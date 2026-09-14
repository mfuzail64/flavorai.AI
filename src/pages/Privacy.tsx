import Header from "@/components/Header";
import LegalLayout from "@/components/legal/LegalLayout";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <LegalLayout title="Privacy Policy" updated="14 September 2026">
      <p>
        This Privacy Policy explains how FlavorAI ("we", "us") collects, uses and protects your
        information when you use our website and services.
      </p>

      <h2>Who we are</h2>
      <p>
        FlavorAI is operated by <strong>[LEGAL ENTITY NAME]</strong>, registered at{" "}
        <strong>[REGISTERED BUSINESS ADDRESS]</strong>. You can reach us at{" "}
        <strong>[SUPPORT EMAIL]</strong> for any privacy question or request.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your email address, display name and, if you sign in with
          Google, the profile name and avatar Google shares with us.
        </li>
        <li>
          <strong>Preferences:</strong> your chosen language and country.
        </li>
        <li>
          <strong>Activity:</strong> recipes you save to favourites and recipes you open, so we can
          show you relevant suggestions.
        </li>
        <li>
          <strong>Technical data:</strong> basic request information needed to keep the service
          secure and to limit abuse.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To generate recipes, images and recommendations you ask for.</li>
        <li>To remember your language and saved recipes across devices.</li>
        <li>To detect misuse and protect the service.</li>
      </ul>

      <h2>Recipe generation and AI</h2>
      <p>
        Recipe text and food images are produced by AI models. The ingredients or search terms you
        enter are sent to our AI provider to produce a result. We do not send your email address or
        account identifiers with those requests.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with the service providers we
        need to run FlavorAI: our hosting and database provider, and our AI model provider. Each
        processes data on our instructions only.
      </p>

      <h2>Retention</h2>
      <p>
        We keep your account data for as long as your account exists. Activity records used for
        recommendations are kept while they remain useful and then removed. Delete your account by
        writing to <strong>[SUPPORT EMAIL]</strong> and we will erase your data.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of your data, ask us to correct it, or ask us to delete it. Write
        to <strong>[SUPPORT EMAIL]</strong> and we will respond within 30 days.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We store your sign-in session and language choice in your browser. These are required for
        the site to work. We do not run advertising or cross-site tracking.
      </p>

      <h2>Children</h2>
      <p>FlavorAI is not intended for children under 13.</p>

      <h2>Changes</h2>
      <p>
        If we change this policy we will update the date at the top of this page and, for
        significant changes, notify you by email.
      </p>
    </LegalLayout>
  </div>
);

export default Privacy;
