
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  cuisine text not null default 'World',
  category text not null default 'Main Course',
  difficulty text not null default 'Easy',
  prep_time int not null default 10,
  cook_time int not null default 20,
  total_time int generated always as (prep_time + cook_time) stored,
  servings int not null default 2,
  image_url text,
  image_status text not null default 'pending',
  tags text[] not null default '{}',
  ingredients jsonb not null default '[]'::jsonb,
  instructions jsonb not null default '[]'::jsonb,
  nutrition jsonb not null default '{}'::jsonb,
  source text not null default 'ai',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_text tsvector
);

create index idx_recipes_search on public.recipes using gin(search_text);
create index idx_recipes_tags on public.recipes using gin(tags);
create index idx_recipes_cuisine on public.recipes(cuisine);
create index idx_recipes_category on public.recipes(category);
create index idx_recipes_total_time on public.recipes(total_time);
create index idx_recipes_calories on public.recipes ((((nutrition->>'calories'))::int));
create index idx_recipes_created_at on public.recipes(created_at desc);

alter table public.recipes enable row level security;

create policy "Recipes are viewable by everyone"
  on public.recipes for select
  using (true);

create or replace function public.recipes_update_search_text()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.search_text :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.cuisine, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(new.category, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.tags, ' '), '')), 'C');
  return new;
end;
$$;

create trigger trg_recipes_search_text
  before insert or update on public.recipes
  for each row execute function public.recipes_update_search_text();

create trigger update_recipes_updated_at
  before update on public.recipes
  for each row execute function public.update_updated_at_column();

create table public.recipe_ingredients_index (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient text not null,
  primary key (recipe_id, ingredient)
);

create index idx_ing_index_ingredient on public.recipe_ingredients_index(ingredient);

alter table public.recipe_ingredients_index enable row level security;

create policy "Ingredient index viewable by everyone"
  on public.recipe_ingredients_index for select
  using (true);

create table public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index idx_favorites_user on public.user_favorites(user_id, created_at desc);

alter table public.user_favorites enable row level security;

create policy "Users view own favorites"
  on public.user_favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users add own favorites"
  on public.user_favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users delete own favorites"
  on public.user_favorites for delete
  to authenticated
  using (auth.uid() = user_id);

create table public.recipe_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index idx_views_recipe_time on public.recipe_views(recipe_id, viewed_at desc);
create index idx_views_user_time on public.recipe_views(user_id, viewed_at desc);

alter table public.recipe_views enable row level security;

create policy "Users view own views"
  on public.recipe_views for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Anyone can record a view"
  on public.recipe_views for insert
  to anon, authenticated
  with check (user_id is null or auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

create policy "Recipe images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'recipe-images');
