/**
 * Landing/chrome strings. One object per language; missing languages fall back to English.
 * To add a language: add a new object with the same keys and register it in `landing`.
 */
const en = {
  hero: {
    label: "AI Meal Coach",
    tagline: "Built for home cooks",
    title1: "AI Meal Coach for",
    titleAccent: "Personalized",
    title2: "Recipes & Meal Plans",
    subtitle: "Get smart meals, calories, and nutrition guidance in seconds — built around what's already in your kitchen.",
    placeholder: "What's in your fridge? (e.g., chicken, rice, tomato)",
    inputLabel: "Ingredients you already have",
    cta: "Generate my meal plan",
    howItWorks: "See how it works",
    createAccount: "Create free account",
    trustSecure: "Secure & private",
    trustCard: "No credit card",
    trustAi: "Personalized by AI",
    trustFast: "Results in seconds",
    free: "Free to start — no credit card needed",
  },
  features: {
    title: "Everything you need to eat better",
    subtitle: "From the ingredients in your fridge to a full week of meals — FlavorAI handles it all.",
    explore: "Explore",
    f1t: "Meal plan in 10 seconds", f1d: "Tell us your goal — get a 7-day plan with macros, prep time, and a grocery list.",
    f2t: "Indian · Keto · Vegetarian", f2d: "Plans tuned for your cuisine and diet. Authentic flavors, smarter portions.",
    f3t: "Weight-loss recipes", f3d: "High-protein, low-calorie meals that actually taste good. Track every macro.",
    f4t: "AI grocery planner", f4d: "Auto-built shopping lists from your weekly plan — never overbuy again.",
  },
  faq: {
    title: "Frequently asked questions",
    q1: "Is FlavorAI free to use?", a1: "Yes — you can generate recipes, plans, and grocery lists without a credit card. Premium AI features unlock with a free account.",
    q2: "How does the AI personalize meals?", a2: "It uses your ingredients, dietary preferences, cuisine, calorie goal, and prep-time constraints to build recipes tuned just for you.",
    q3: "Can I use it for Indian, Keto, or Vegetarian diets?", a3: "Absolutely. Pick a collection or set your preference once — every recommendation respects it.",
    q4: "Is my data secure?", a4: "Your account is protected with industry-standard encryption and we never sell your data. You can delete your account anytime.",
    q5: "Does it work on mobile?", a5: "FlavorAI is mobile-first. Add it to your home screen for a native-feeling app experience.",
  },
  footer: {
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    refund: "Refund Policy",
    disclaimer: "Recipes and images are AI-generated. Check ingredients against your own dietary needs.",
  },
  header: { startFree: "Start Free", openMenu: "Open menu", chooseLanguage: "Choose language" },
};

type Dict = typeof en;

const hi: Dict = {
  hero: {
    label: "AI मील कोच", tagline: "घर पर खाना बनाने वालों के लिए",
    title1: "आपकी", titleAccent: "पर्सनलाइज़्ड", title2: "रेसिपी और मील प्लान के लिए AI मील कोच",
    subtitle: "सेकंडों में स्मार्ट भोजन, कैलोरी और पोषण मार्गदर्शन पाएं — आपकी रसोई में जो पहले से है उसी के आधार पर।",
    placeholder: "आपके फ्रिज में क्या है? (जैसे चिकन, चावल, टमाटर)", inputLabel: "आपके पास मौजूद सामग्री",
    cta: "मेरा मील प्लान बनाएं", howItWorks: "देखें यह कैसे काम करता है", createAccount: "मुफ़्त खाता बनाएं",
    trustSecure: "सुरक्षित और निजी", trustCard: "क्रेडिट कार्ड नहीं चाहिए", trustAi: "AI द्वारा पर्सनलाइज़्ड", trustFast: "सेकंडों में परिणाम",
    free: "शुरू करना मुफ़्त — क्रेडिट कार्ड की ज़रूरत नहीं",
  },
  features: {
    title: "बेहतर खाने के लिए सब कुछ", subtitle: "फ्रिज की सामग्री से लेकर पूरे हफ़्ते के भोजन तक — FlavorAI सब संभालता है।", explore: "देखें",
    f1t: "10 सेकंड में मील प्लान", f1d: "अपना लक्ष्य बताएं — मैक्रो, तैयारी समय और किराना सूची के साथ 7-दिन का प्लान पाएं।",
    f2t: "भारतीय · कीटो · शाकाहारी", f2d: "आपके व्यंजन और आहार के अनुसार प्लान। असली स्वाद, समझदार मात्रा।",
    f3t: "वज़न घटाने की रेसिपी", f3d: "हाई-प्रोटीन, कम कैलोरी वाले स्वादिष्ट भोजन। हर मैक्रो ट्रैक करें।",
    f4t: "AI किराना प्लानर", f4d: "साप्ताहिक प्लान से अपने आप बनी खरीदारी सूची — ज़रूरत से ज़्यादा न खरीदें।",
  },
  faq: {
    title: "अक्सर पूछे जाने वाले प्रश्न",
    q1: "क्या FlavorAI मुफ़्त है?", a1: "हाँ — आप बिना क्रेडिट कार्ड के रेसिपी, प्लान और किराना सूची बना सकते हैं। मुफ़्त खाते से प्रीमियम AI सुविधाएँ खुलती हैं।",
    q2: "AI भोजन को कैसे पर्सनलाइज़ करता है?", a2: "यह आपकी सामग्री, आहार पसंद, व्यंजन, कैलोरी लक्ष्य और समय सीमा के आधार पर रेसिपी बनाता है।",
    q3: "क्या मैं इसे भारतीय, कीटो या शाकाहारी आहार के लिए उपयोग कर सकता हूँ?", a3: "बिल्कुल। एक संग्रह चुनें या अपनी पसंद एक बार सेट करें — हर सुझाव उसका पालन करेगा।",
    q4: "क्या मेरा डेटा सुरक्षित है?", a4: "आपका खाता मानक एन्क्रिप्शन से सुरक्षित है और हम आपका डेटा कभी नहीं बेचते। आप कभी भी खाता हटा सकते हैं।",
    q5: "क्या यह मोबाइल पर काम करता है?", a5: "FlavorAI मोबाइल-फ़र्स्ट है। ऐप जैसे अनुभव के लिए इसे होम स्क्रीन पर जोड़ें।",
  },
  footer: { legal: "कानूनी", privacy: "गोपनीयता नीति", terms: "नियम और शर्तें", refund: "रिफ़ंड नीति", disclaimer: "रेसिपी और चित्र AI द्वारा बनाए गए हैं। सामग्री को अपनी आहार ज़रूरतों के अनुसार जाँचें।" },
  header: { startFree: "मुफ़्त शुरू करें", openMenu: "मेनू खोलें", chooseLanguage: "भाषा चुनें" },
};

const kn: Dict = {
  hero: {
    label: "AI ಊಟ ಕೋಚ್", tagline: "ಮನೆ ಅಡುಗೆಯವರಿಗಾಗಿ",
    title1: "ನಿಮ್ಮ", titleAccent: "ವೈಯಕ್ತಿಕ", title2: "ಪಾಕವಿಧಾನ ಮತ್ತು ಊಟದ ಯೋಜನೆಗಳಿಗೆ AI ಕೋಚ್",
    subtitle: "ನಿಮ್ಮ ಅಡುಗೆಮನೆಯಲ್ಲಿ ಇರುವುದರ ಆಧಾರದ ಮೇಲೆ ಕ್ಷಣಗಳಲ್ಲಿ ಸ್ಮಾರ್ಟ್ ಊಟ, ಕ್ಯಾಲೋರಿ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.",
    placeholder: "ನಿಮ್ಮ ಫ್ರಿಜ್‌ನಲ್ಲಿ ಏನಿದೆ? (ಉದಾ. ಚಿಕನ್, ಅಕ್ಕಿ, ಟೊಮೆಟೊ)", inputLabel: "ನಿಮ್ಮ ಬಳಿ ಇರುವ ಪದಾರ್ಥಗಳು",
    cta: "ನನ್ನ ಊಟದ ಯೋಜನೆ ರಚಿಸಿ", howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", createAccount: "ಉಚಿತ ಖಾತೆ ರಚಿಸಿ",
    trustSecure: "ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ", trustCard: "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬೇಡ", trustAi: "AI ವೈಯಕ್ತೀಕರಣ", trustFast: "ಕ್ಷಣಗಳಲ್ಲಿ ಫಲಿತಾಂಶ",
    free: "ಪ್ರಾರಂಭಿಸಲು ಉಚಿತ — ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ",
  },
  features: {
    title: "ಉತ್ತಮವಾಗಿ ತಿನ್ನಲು ಬೇಕಾದ ಎಲ್ಲವೂ", subtitle: "ಫ್ರಿಜ್‌ನ ಪದಾರ್ಥಗಳಿಂದ ವಾರದ ಊಟದವರೆಗೆ — FlavorAI ಎಲ್ಲವನ್ನೂ ನೋಡಿಕೊಳ್ಳುತ್ತದೆ.", explore: "ಅನ್ವೇಷಿಸಿ",
    f1t: "10 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಊಟದ ಯೋಜನೆ", f1d: "ನಿಮ್ಮ ಗುರಿ ತಿಳಿಸಿ — ಮ್ಯಾಕ್ರೋ, ತಯಾರಿ ಸಮಯ ಮತ್ತು ದಿನಸಿ ಪಟ್ಟಿಯೊಂದಿಗೆ 7-ದಿನದ ಯೋಜನೆ.",
    f2t: "ಭಾರತೀಯ · ಕೀಟೊ · ಸಸ್ಯಾಹಾರಿ", f2d: "ನಿಮ್ಮ ಆಹಾರ ಶೈಲಿಗೆ ತಕ್ಕ ಯೋಜನೆಗಳು. ನಿಜವಾದ ರುಚಿ, ಸರಿಯಾದ ಪ್ರಮಾಣ.",
    f3t: "ತೂಕ ಇಳಿಕೆ ಪಾಕವಿಧಾನಗಳು", f3d: "ಹೆಚ್ಚು ಪ್ರೋಟೀನ್, ಕಡಿಮೆ ಕ್ಯಾಲೋರಿಯ ರುಚಿಕರ ಊಟ.",
    f4t: "AI ದಿನಸಿ ಯೋಜಕ", f4d: "ವಾರದ ಯೋಜನೆಯಿಂದ ಸ್ವಯಂ ಶಾಪಿಂಗ್ ಪಟ್ಟಿ.",
  },
  faq: {
    title: "ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು",
    q1: "FlavorAI ಉಚಿತವೇ?", a1: "ಹೌದು — ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಇಲ್ಲದೆ ಪಾಕವಿಧಾನ, ಯೋಜನೆ ಮತ್ತು ದಿನಸಿ ಪಟ್ಟಿ ರಚಿಸಬಹುದು.",
    q2: "AI ಊಟವನ್ನು ಹೇಗೆ ವೈಯಕ್ತೀಕರಿಸುತ್ತದೆ?", a2: "ನಿಮ್ಮ ಪದಾರ್ಥ, ಆಹಾರ ಆದ್ಯತೆ, ಪಾಕಶೈಲಿ, ಕ್ಯಾಲೋರಿ ಗುರಿ ಮತ್ತು ಸಮಯವನ್ನು ಬಳಸುತ್ತದೆ.",
    q3: "ಭಾರತೀಯ, ಕೀಟೊ ಅಥವಾ ಸಸ್ಯಾಹಾರಕ್ಕೆ ಬಳಸಬಹುದೇ?", a3: "ಖಂಡಿತ. ಒಮ್ಮೆ ಆದ್ಯತೆ ಹೊಂದಿಸಿ — ಪ್ರತಿಯೊಂದು ಸಲಹೆ ಅದನ್ನು ಪಾಲಿಸುತ್ತದೆ.",
    q4: "ನನ್ನ ಡೇಟಾ ಸುರಕ್ಷಿತವೇ?", a4: "ನಿಮ್ಮ ಖಾತೆ ಎನ್‌ಕ್ರಿಪ್ಶನ್‌ನಿಂದ ರಕ್ಷಿತ. ನಾವು ಡೇಟಾ ಮಾರುವುದಿಲ್ಲ. ಯಾವಾಗ ಬೇಕಾದರೂ ಖಾತೆ ಅಳಿಸಬಹುದು.",
    q5: "ಮೊಬೈಲ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆಯೇ?", a5: "ಹೌದು, FlavorAI ಮೊಬೈಲ್-ಮೊದಲು ವಿನ್ಯಾಸಗೊಂಡಿದೆ.",
  },
  footer: { legal: "ಕಾನೂನು", privacy: "ಗೌಪ್ಯತಾ ನೀತಿ", terms: "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು", refund: "ಮರುಪಾವತಿ ನೀತಿ", disclaimer: "ಪಾಕವಿಧಾನ ಮತ್ತು ಚಿತ್ರಗಳು AI ನಿಂದ ರಚಿತ. ನಿಮ್ಮ ಆಹಾರ ಅಗತ್ಯಗಳಿಗೆ ತಕ್ಕಂತೆ ಪರಿಶೀಲಿಸಿ." },
  header: { startFree: "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ", openMenu: "ಮೆನು ತೆರೆಯಿರಿ", chooseLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ" },
};

const ur: Dict = {
  hero: {
    label: "AI میل کوچ", tagline: "گھر میں کھانا پکانے والوں کے لیے",
    title1: "آپ کی", titleAccent: "ذاتی", title2: "ترکیبوں اور میل پلانز کے لیے AI کوچ",
    subtitle: "سیکنڈوں میں سمارٹ کھانے، کیلوریز اور غذائی رہنمائی حاصل کریں — جو آپ کے باورچی خانے میں پہلے سے موجود ہے اسی کی بنیاد پر۔",
    placeholder: "آپ کے فریج میں کیا ہے؟ (مثلاً چکن، چاول، ٹماٹر)", inputLabel: "آپ کے پاس موجود اجزاء",
    cta: "میرا میل پلان بنائیں", howItWorks: "دیکھیں یہ کیسے کام کرتا ہے", createAccount: "مفت اکاؤنٹ بنائیں",
    trustSecure: "محفوظ اور نجی", trustCard: "کریڈٹ کارڈ کی ضرورت نہیں", trustAi: "AI سے ذاتی", trustFast: "سیکنڈوں میں نتائج",
    free: "شروع کرنا مفت — کریڈٹ کارڈ کی ضرورت نہیں",
  },
  features: {
    title: "بہتر کھانے کے لیے سب کچھ", subtitle: "فریج کے اجزاء سے پورے ہفتے کے کھانوں تک — FlavorAI سب سنبھالتا ہے۔", explore: "دیکھیں",
    f1t: "10 سیکنڈ میں میل پلان", f1d: "اپنا ہدف بتائیں — میکروز، تیاری کا وقت اور گروسری فہرست کے ساتھ 7 دن کا پلان۔",
    f2t: "ہندوستانی · کیٹو · سبزی خور", f2d: "آپ کے کھانوں اور غذا کے مطابق پلان۔",
    f3t: "وزن کم کرنے کی ترکیبیں", f3d: "زیادہ پروٹین، کم کیلوری والے مزیدار کھانے۔",
    f4t: "AI گروسری پلانر", f4d: "ہفتہ وار پلان سے خودکار خریداری فہرست۔",
  },
  faq: {
    title: "اکثر پوچھے گئے سوالات",
    q1: "کیا FlavorAI مفت ہے؟", a1: "جی ہاں — آپ بغیر کریڈٹ کارڈ کے ترکیبیں، پلان اور گروسری فہرستیں بنا سکتے ہیں۔",
    q2: "AI کھانوں کو کیسے ذاتی بناتا ہے؟", a2: "یہ آپ کے اجزاء، غذائی ترجیحات، کھانوں، کیلوری ہدف اور وقت کو استعمال کرتا ہے۔",
    q3: "کیا میں اسے ہندوستانی، کیٹو یا سبزی خور غذا کے لیے استعمال کر سکتا ہوں؟", a3: "بالکل۔ ایک بار ترجیح طے کریں — ہر تجویز اس کا خیال رکھے گی۔",
    q4: "کیا میرا ڈیٹا محفوظ ہے؟", a4: "آپ کا اکاؤنٹ انکرپشن سے محفوظ ہے اور ہم آپ کا ڈیٹا کبھی نہیں بیچتے۔",
    q5: "کیا یہ موبائل پر کام کرتا ہے؟", a5: "جی ہاں، FlavorAI موبائل کے لیے بنایا گیا ہے۔",
  },
  footer: { legal: "قانونی", privacy: "رازداری کی پالیسی", terms: "شرائط و ضوابط", refund: "رقم کی واپسی کی پالیسی", disclaimer: "ترکیبیں اور تصاویر AI سے بنی ہیں۔ اجزاء کو اپنی غذائی ضروریات کے مطابق جانچیں۔" },
  header: { startFree: "مفت شروع کریں", openMenu: "مینو کھولیں", chooseLanguage: "زبان منتخب کریں" },
};

const ar: Dict = {
  hero: {
    label: "مدرب الوجبات الذكي", tagline: "مصمم للطهاة في المنزل",
    title1: "مدرب ذكي لوصفات", titleAccent: "مخصصة", title2: "وخطط وجبات",
    subtitle: "احصل على وجبات ذكية وسعرات حرارية وإرشادات غذائية في ثوانٍ — بناءً على ما في مطبخك بالفعل.",
    placeholder: "ماذا يوجد في ثلاجتك؟ (مثل الدجاج، الأرز، الطماطم)", inputLabel: "المكونات المتوفرة لديك",
    cta: "أنشئ خطة وجباتي", howItWorks: "شاهد كيف يعمل", createAccount: "أنشئ حسابًا مجانيًا",
    trustSecure: "آمن وخاص", trustCard: "بدون بطاقة ائتمان", trustAi: "مخصص بالذكاء الاصطناعي", trustFast: "نتائج في ثوانٍ",
    free: "ابدأ مجانًا — لا حاجة لبطاقة ائتمان",
  },
  features: {
    title: "كل ما تحتاجه لتأكل بشكل أفضل", subtitle: "من مكونات ثلاجتك إلى وجبات أسبوع كامل — FlavorAI يتولى كل شيء.", explore: "استكشف",
    f1t: "خطة وجبات في 10 ثوانٍ", f1d: "أخبرنا بهدفك — واحصل على خطة 7 أيام مع العناصر الغذائية ووقت التحضير وقائمة البقالة.",
    f2t: "هندي · كيتو · نباتي", f2d: "خطط مصممة لمطبخك ونظامك الغذائي.",
    f3t: "وصفات إنقاص الوزن", f3d: "وجبات غنية بالبروتين وقليلة السعرات ولذيذة.",
    f4t: "مخطط البقالة الذكي", f4d: "قوائم تسوق تلقائية من خطتك الأسبوعية.",
  },
  faq: {
    title: "الأسئلة الشائعة",
    q1: "هل FlavorAI مجاني؟", a1: "نعم — يمكنك إنشاء الوصفات والخطط وقوائم البقالة دون بطاقة ائتمان.",
    q2: "كيف يخصص الذكاء الاصطناعي الوجبات؟", a2: "يستخدم مكوناتك وتفضيلاتك الغذائية والمطبخ وهدف السعرات والوقت المتاح.",
    q3: "هل يمكنني استخدامه للأنظمة الهندية أو الكيتو أو النباتية؟", a3: "بالتأكيد. حدد تفضيلك مرة واحدة — وكل توصية ستحترمه.",
    q4: "هل بياناتي آمنة؟", a4: "حسابك محمي بالتشفير ولا نبيع بياناتك أبدًا. يمكنك حذف حسابك في أي وقت.",
    q5: "هل يعمل على الهاتف؟", a5: "نعم، FlavorAI مصمم للهاتف أولاً.",
  },
  footer: { legal: "قانوني", privacy: "سياسة الخصوصية", terms: "الشروط والأحكام", refund: "سياسة الاسترداد", disclaimer: "الوصفات والصور مُنشأة بالذكاء الاصطناعي. تحقق من المكونات وفق احتياجاتك الغذائية." },
  header: { startFree: "ابدأ مجانًا", openMenu: "افتح القائمة", chooseLanguage: "اختر اللغة" },
};

export const landing: Record<string, Dict> = { en, hi, kn, ur, ar };
