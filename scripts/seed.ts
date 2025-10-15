import "dotenv/config";

import config from "@payload-config";
import { getPayload } from "payload";

import { env } from "@/env";

const categories = [
  {
    name: "Digital Assets",
    slug: "digital-assets",
    subcategories: [
      { name: "Icons & Illustrations", slug: "icons-illustrations" },
      { name: "UI Kits & Templates", slug: "ui-kits-templates" },
      { name: "3D Models", slug: "3d-models" },
      { name: "Textures & Backgrounds", slug: "textures-backgrounds" },
      { name: "Presentation Templates", slug: "presentation-templates" },
    ],
  },
  {
    name: "Software & Tools",
    slug: "software-tools",
    subcategories: [
      { name: "SaaS Products", slug: "saas-products" },
      { name: "Plugins & Extensions", slug: "plugins-extensions" },
      { name: "Scripts & Code Snippets", slug: "scripts-code-snippets" },
      { name: "Automation Tools", slug: "automation-tools" },
      { name: "AI Tools", slug: "ai-tools" },
    ],
  },
  {
    name: "Graphics & Design",
    slug: "graphics-design",
    subcategories: [
      { name: "Logos & Branding", slug: "logos-branding" },
      { name: "Posters & Flyers", slug: "posters-flyers" },
      { name: "Business Cards", slug: "business-cards" },
      { name: "Social Media Kits", slug: "social-media-kits" },
      { name: "Mockups", slug: "mockups" },
    ],
  },
  {
    name: "Audio & Music",
    slug: "audio-music",
    subcategories: [
      { name: "Beats & Instrumentals", slug: "beats-instrumentals" },
      { name: "Sound Effects", slug: "sound-effects" },
      { name: "Voiceovers", slug: "voiceovers" },
      { name: "Royalty-Free Music", slug: "royalty-free-music" },
      { name: "Loops & Samples", slug: "loops-samples" },
    ],
  },
  {
    name: "Video & Animation",
    slug: "video-animation",
    subcategories: [
      { name: "Video Templates", slug: "video-templates" },
      { name: "Stock Footage", slug: "stock-footage" },
      { name: "Motion Graphics", slug: "motion-graphics" },
      { name: "Intro & Outro Templates", slug: "intro-outro-templates" },
      { name: "Transitions & Effects", slug: "transitions-effects" },
    ],
  },
  {
    name: "Web & App Templates",
    slug: "web-app-templates",
    subcategories: [
      { name: "Website Templates", slug: "website-templates" },
      { name: "Landing Pages", slug: "landing-pages" },
      { name: "Email Templates", slug: "email-templates" },
      { name: "Mobile UI Kits", slug: "mobile-ui-kits" },
      { name: "Dashboard Templates", slug: "dashboard-templates" },
    ],
  },
  {
    name: "Marketing & Branding",
    slug: "marketing-branding",
    subcategories: [
      { name: "Social Media Templates", slug: "social-media-templates" },
      { name: "Email Marketing Assets", slug: "email-marketing-assets" },
      { name: "Ad Banners", slug: "ad-banners" },
      { name: "Brand Guidelines", slug: "brand-guidelines" },
    ],
  },
  {
    name: "Writing & Content",
    slug: "writing-content",
    subcategories: [
      { name: "Copywriting Templates", slug: "copywriting-templates" },
      { name: "Blog Templates", slug: "blog-templates" },
      { name: "Ebook Templates", slug: "ebook-templates" },
      { name: "Resume & Portfolio", slug: "resume-portfolio" },
      { name: "Press Kits", slug: "press-kits" },
    ],
  },
  {
    name: "Education & E-Learning",
    slug: "education-e-learning",
    subcategories: [
      { name: "Course Materials", slug: "course-materials" },
      { name: "Presentation Decks", slug: "presentation-decks" },
      { name: "Study Guides", slug: "study-guides" },
      { name: "Printable Resources", slug: "printable-resources" },
      { name: "Teacher Templates", slug: "teacher-templates" },
    ],
  },
  {
    name: "Photography",
    slug: "photography",
    subcategories: [
      { name: "Stock Photos", slug: "stock-photos" },
      { name: "Lightroom Presets", slug: "lightroom-presets" },
      { name: "Photo Overlays", slug: "photo-overlays" },
      { name: "Photo Filters", slug: "photo-filters" },
      { name: "Background Removers", slug: "background-removers" },
    ],
  },
  {
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    subcategories: [
      { name: "AI Prompts", slug: "ai-prompts" },
      { name: "Chatbot Templates", slug: "chatbot-templates" },
      { name: "AI Image Generators", slug: "ai-image-generators" },
      { name: "AI Writing Tools", slug: "ai-writing-tools" },
      { name: "Machine Learning Models", slug: "machine-learning-models" },
    ],
  },
  {
    name: "Productivity & Organization",
    slug: "productivity-organization",
    subcategories: [
      { name: "Notion Templates", slug: "notion-templates" },
      { name: "Project Planners", slug: "project-planners" },
      { name: "Task Trackers", slug: "task-trackers" },
      { name: "Time Management Tools", slug: "time-management-tools" },
      { name: "Goal Trackers", slug: "goal-trackers" },
    ],
  },
  {
    name: "Business Tools",
    slug: "business-tools",
    subcategories: [
      { name: "Invoice Templates", slug: "invoice-templates" },
      { name: "Contracts & Agreements", slug: "contracts-agreements" },
      { name: "Pitch Decks", slug: "pitch-decks" },
      { name: "Business Plans", slug: "business-plans" },
      { name: "Startup Resources", slug: "startup-resources" },
    ],
  },
  {
    name: "Data & Analytics",
    slug: "data-analytics",
    subcategories: [
      { name: "Excel Templates", slug: "excel-templates" },
      { name: "Google Sheets Dashboards", slug: "google-sheets-dashboards" },
      { name: "Data Visualization", slug: "data-visualization" },
      { name: "Reports & Dashboards", slug: "reports-dashboards" },
      { name: "Analytics Tools", slug: "analytics-tools" },
    ],
  },
  {
    name: "Gaming Assets",
    slug: "gaming-assets",
    subcategories: [
      { name: "Game Art & Sprites", slug: "game-art-sprites" },
      { name: "Sound Effects & Music", slug: "sound-effects-music" },
      { name: "Game UI Kits", slug: "game-ui-kits" },
      { name: "3D Game Models", slug: "3d-game-models" },
      { name: "Unity & Unreal Assets", slug: "unity-unreal-assets" },
    ],
  },
  {
    name: "Social Media",
    slug: "social-media",
    subcategories: [
      { name: "Instagram Templates", slug: "instagram-templates" },
      { name: "YouTube Assets", slug: "youtube-assets" },
      { name: "TikTok Templates", slug: "tiktok-templates" },
      { name: "Twitter/X Graphics", slug: "twitter-x-graphics" },
      { name: "LinkedIn Banners", slug: "linkedin-banners" },
    ],
  },
  {
    name: "Lifestyle & Hobbies",
    slug: "lifestyle-hobbies",
    subcategories: [
      { name: "Printable Planners", slug: "printable-planners" },
      { name: "Cooking Templates", slug: "cooking-templates" },
      { name: "Travel Guides", slug: "travel-guides" },
      { name: "DIY & Crafts", slug: "diy-crafts" },
      { name: "Home Organization", slug: "home-organization" },
    ],
  },
  {
    name: "Print & Branding",
    slug: "print-branding",
    subcategories: [
      { name: "Business Card Templates", slug: "business-card-templates" },
      { name: "Flyers & Posters", slug: "flyers-posters" },
      { name: "Brochures", slug: "brochures" },
      { name: "Packaging Design", slug: "packaging-design" },
      { name: "Stationery Kits", slug: "stationery-kits" },
    ],
  },
  {
    name: "Developer Resources",
    slug: "developer-resources",
    subcategories: [
      { name: "APIs & SDKs", slug: "apis-sdks" },
      { name: "Code Snippets", slug: "code-snippets" },
      { name: "Boilerplates", slug: "boilerplates" },
      { name: "NPM Packages", slug: "npm-packages" },
      { name: "CLI Tools", slug: "cli-tools" },
    ],
  },
  {
    name: "Finance & Investing",
    slug: "finance-investing",
    subcategories: [
      { name: "Budget Templates", slug: "budget-templates" },
      { name: "Investment Trackers", slug: "investment-trackers" },
      { name: "Crypto Tools", slug: "crypto-tools" },
      { name: "Tax Calculators", slug: "tax-calculators" },
      { name: "Personal Finance Sheets", slug: "personal-finance-sheets" },
    ],
  },
  {
    name: "Other",
    slug: "other",
  },
];

(async () => {
  const payload = await getPayload({ config });

  await payload.create({
    collection: "users",
    data: {
      fullname: "Admin Account",
      email: "admin@tus.in",
      password: env.SUPER_ADMIN_PASSWORD,
      role: "super_admin",
    },
  });

  for (const category of categories) {
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        label: category.name,
        slug: category.slug,
        parent: null,
      },
    });

    for (const subcategory of category.subcategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          label: subcategory.name,
          slug: subcategory.slug,
          parent: parentCategory.id,
        },
      });
    }
  }

  // biome-ignore lint/suspicious/noConsole: _
  console.log("✅ DB seeded successfully");
  process.exit(0);
})();
