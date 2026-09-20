/**
 * EDIT THIS FILE to personalize the portfolio.
 * - Put images in dist/assets/ and use paths like "assets/my-photo.jpg".
 * - Leave an image path empty ("") to keep the built-in placeholder.
 * - Each category becomes one clickable object in the cart.
 * - Add or remove entries inside any category without touching the layout code.
 */
window.PORTFOLIO_DATA = {
  siteName: "YI WEN'S MINI MART",
  managerPhoto: "", // Example: "assets/yiwen-manager.jpg"
  resumeUrl: "#", // Example: "assets/yiwen-resume.pdf"
  email: "hello@example.com",
  // Keep this short: these tags float on the welcome screen as a quick portfolio overview.
  overviewTags: ["EX-TIKTOK", "EX-SHOPEE", "PRODUCT CURIOUS", "BUILD · TEST · GROW"],

  dialogue: [
    {
      title: "Hi, I'm Yi Wen.",
      copy: "I'm your 2D store manager. Thanks for stopping by."
    },
    {
      title: "A portfolio you can play.",
      copy: "Tap the cards to explore my work, ideas and experiences. Ready? Let's go."
    }
  ],

  audio: {
    youtubeId: "vxPrlc2rtuk", // The part after v= in your YouTube link.
    musicVolume: 22, // 0–100. Music starts only after Store Radio is switched on.
    chatter: "assets/crowd-murmur.mp3", // Real CC0 crowd audio; credits in assets/AUDIO-CREDITS.md.
    chatterVolume: 0.055, // 0–1. Quiet enough to sit behind the music.
    chatterGap: [18, 35], // Seconds of silence between snippets.
    chatterDuration: [4, 7] // Seconds per snippet, with gentle fades.
  },

  categories: [
    {
      id: "entrepreneurship",
      label: "Past Entrepreneurship",
      shortLabel: "VENTURES",
      featured: true, // Featured categories receive the largest card in the cart.
      icon: "🚀",
      color: "#f8ef65",
      tag: "FEATURED",
      metric: "FROM IDEA TO EXECUTION",
      summary: "My past ventures: the problems I chose to solve, what I built, and what I learned along the way.",
      image: "", // Example: "assets/my-venture.jpg"
      entries: [
        { title: "Your venture name", meta: "FOUNDER / CO-FOUNDER · YEAR", text: "Describe the customer problem and why you decided to build a business around it." },
        { title: "What I built & owned", meta: "PRODUCT · CUSTOMERS · OPERATIONS", text: "Add your role, early experiments, customer conversations and the work you personally led." },
        { title: "Results & lessons", meta: "TRACTION · REFLECTION", text: "Share verified results, challenges and how this experience shaped your entrepreneurial ambitions." }
      ]
    },
    {
      id: "work",
      label: "Work Experience",
      shortLabel: "WORK",
      icon: "🛍️",
      color: "#ffc6d9",
      tag: "AISLE 01",
      metric: "3 ROLES · 100% HANDS-ON",
      summary: "The places where I learned to build, launch and grow ideas with real teams.",
      image: "",
      logos: ["LOGO 01", "LOGO 02"], // Replace with company names or logo image paths later.
      entries: [
        { title: "Company / Role", meta: "20XX — PRESENT", text: "Add a concise description of your impact, ownership and results here." },
        { title: "Company / Role", meta: "20XX — 20XX", text: "Use one or two lines focused on what changed because of your work." }
      ]
    },
    {
      id: "projects",
      label: "Projects & Automations",
      shortLabel: "PROJECTS",
      icon: "💻",
      color: "#b8d8c0",
      tag: "AISLE 02",
      metric: "4 BUILDS · MANY SHORTCUTS",
      summary: "Small systems, experiments and automations made to solve practical problems.",
      image: "",
      entries: [
        { title: "Project name", meta: "TOOLS · YEAR", text: "Explain the problem, your approach and the outcome." },
        { title: "Automation name", meta: "WORKFLOW · YEAR", text: "Add a link in the text or extend this entry with a URL field." }
      ]
    },
    {
      id: "hackathons",
      label: "Hackathons",
      shortLabel: "HACKS",
      icon: "🎟️",
      color: "#f8ef65",
      tag: "AISLE 03",
      metric: "48 HOURS · ZERO SLEEP",
      summary: "Fast, collaborative builds where constraints made the ideas sharper.",
      image: "",
      entries: [
        { title: "Hackathon / Award", meta: "TEAM OF 4 · YEAR", text: "Describe the idea, your role and what the judges or users valued." }
      ]
    },
    {
      id: "education",
      label: "Education",
      shortLabel: "SCHOOL",
      icon: "📓",
      color: "#bdeef2",
      tag: "AISLE 04",
      metric: "ALWAYS LEARNING",
      summary: "Formal study, useful rabbit holes and the foundations behind how I think.",
      image: "",
      entries: [
        { title: "University / Programme", meta: "20XX — 20XX", text: "Add your degree, specialization, activities and relevant coursework." }
      ]
    },
    {
      id: "creator",
      label: "Creator & Marketing",
      shortLabel: "CREATE",
      icon: "📷",
      color: "#f4a6bd",
      tag: "AISLE 05",
      metric: "STORIES THAT MOVE",
      summary: "Content and campaigns shaped around what people notice, feel and remember.",
      image: "",
      entries: [
        { title: "Campaign / Channel", meta: "PLATFORM · YEAR", text: "Add audience, creative concept and a clear performance result." }
      ]
    },
    {
      id: "global",
      label: "Global Experiences / NOC",
      shortLabel: "GLOBAL",
      icon: "✈️",
      color: "#c7d9a7",
      tag: "AISLE 06",
      metric: "NEW CITIES · NEW LENSES",
      summary: "Experiences that stretched my worldview and how I work across cultures.",
      image: "",
      entries: [
        { title: "NOC / Global experience", meta: "CITY · YEAR", text: "Add the venture, community or perspective that shaped you." }
      ]
    },
    {
      id: "about",
      label: "About Me",
      shortLabel: "ABOUT",
      icon: "🪩",
      color: "#ccb8e8",
      tag: "AISLE 07",
      metric: "CURIOUS BY DEFAULT",
      summary: "A few things I care about beyond job titles and project decks.",
      image: "",
      entries: [
        { title: "Currently curious about", meta: "RIGHT NOW", text: "Add interests, side quests, values or a small detail people remember." }
      ]
    },
    {
      id: "resume",
      label: "Résumé",
      shortLabel: "CV",
      icon: "🧾",
      color: "#ffffff",
      tag: "AISLE 08",
      metric: "ONE PAGE · THE QUICK VERSION",
      summary: "The tidy, printable version of everything in this cart.",
      image: "",
      entries: [
        { title: "Résumé placeholder", meta: "PDF COMING SOON", text: "Set resumeUrl near the top of this file when your PDF is ready." }
      ]
    }
  ]
};
