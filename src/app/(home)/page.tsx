import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/modules/home/components/hero-section";

const featuredProducts = [
  {
    id: "product-1",
    name: "Essential Icon Pack Pro",
    description:
      "A comprehensive collection of 2000+ minimal line icons for your next project",
    longDescription: `<p>Elevate your designs with our Essential Icon Pack Pro, featuring over 2000 meticulously crafted line icons. Each icon is designed with precision on a 24x24 grid, ensuring consistent quality across your projects.</p>

<p>The pack includes icons for:</p>
<ul>
  <li>UI elements and interface design</li>
  <li>Business, finance, and e-commerce</li>
  <li>Social media and communication</li>
  <li>Weather, nature, and environment</li>
  <li>Technology, devices, and development</li>
  <li>And much more!</li>
</ul>

<p>All icons come in SVG, PNG, and Adobe formats, with both light and dark variants. The SVGs are fully customizable, allowing you to adjust colors, strokes, and sizes to match your design system.</p>

<p>Regularly updated with new icons based on customer requests and design trends.</p>`,
    price: 49,
    discountPercentage: 20,
    thumbnailUrl:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    previewImages: [
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4475523/pexels-photo-4475523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    fileType: "SVG, PNG, AI, Sketch",
    fileSize: "48 MB",
    lastUpdated: "July 15, 2024",
    rating: 4.8,
    reviewCount: 124,
    vendorId: "vendor-1",
    vendor: {
      id: "vendor-1",
      name: "DesignLab Studio",
      avatarUrl:
        "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      verified: true,
    },
    categories: ["icons", "ui-elements"],
  },
  {
    id: "product-2",
    name: "Modern UI Kit Bundle",
    description:
      "Complete UI kit with 600+ components for web and mobile applications",
    longDescription: `<p>The Modern UI Kit Bundle is the ultimate resource for designers and developers looking to create beautiful, consistent interfaces. With over 600 components designed for both web and mobile platforms, this bundle has everything you need.</p>

<p>Features include:</p>
<ul>
  <li>Fully responsive components that adapt to any screen size</li>
  <li>Dark and light mode variants for every element</li>
  <li>Material Design, iOS, and custom styled components</li>
  <li>Interactive prototyping components with animations</li>
  <li>Comprehensive documentation and usage examples</li>
  <li>Regular updates and additions</li>
</ul>

<p>The kit is available in Figma, Sketch, and Adobe XD formats, with all components organized in libraries and properly named layers for easy customization.</p>

<p>Ideal for startups, agencies, and individual designers looking to speed up their workflow without sacrificing quality.</p>`,
    price: 79,
    discountPercentage: 0,
    thumbnailUrl:
      "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    previewImages: [
      "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/5926397/pexels-photo-5926397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6804079/pexels-photo-6804079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    fileType: "Figma, Sketch, XD",
    fileSize: "156 MB",
    lastUpdated: "August 3, 2024",
    rating: 4.9,
    reviewCount: 89,
    vendorId: "vendor-2",
    vendor: {
      id: "vendor-2",
      name: "PixelPerfect UI",
      avatarUrl:
        "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      verified: true,
    },
    categories: ["ui-kits", "templates"],
  },
  {
    id: "product-3",
    name: "SaaS Landing Page Template",
    description:
      "Professional template for SaaS products with multiple sections and components",
    longDescription: `<p>Launch your SaaS product with a professional, conversion-optimized landing page template designed specifically for digital products and services.</p>

<p>This template includes:</p>
<ul>
  <li>Modular sections for hero, features, pricing, testimonials, and more</li>
  <li>Mobile-first responsive design that looks great on all devices</li>
  <li>Clean, modern aesthetic with customizable color schemes</li>
  <li>Optimized for fast loading and high performance</li>
  <li>SEO-friendly structure and semantic HTML</li>
  <li>Integration-ready forms for newsletter and demo requests</li>
</ul>

<p>Built with modern technologies including HTML5, CSS3, and JavaScript, with optional React and Vue versions available. Easy to customize and deploy, with detailed documentation included.</p>

<p>Perfect for startups, established SaaS businesses, and developers building client websites.</p>`,
    price: 39,
    discountPercentage: 0,
    thumbnailUrl:
      "https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    previewImages: [
      "https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    fileType: "HTML, CSS, JS, React, Vue",
    fileSize: "24 MB",
    lastUpdated: "June 28, 2024",
    rating: 4.7,
    reviewCount: 56,
    vendorId: "vendor-3",
    vendor: {
      id: "vendor-3",
      name: "WebTemplate Pro",
      avatarUrl:
        "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      verified: false,
    },
    categories: ["templates", "landing-pages"],
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <HeroSection />
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Trending Products
          </h2>
          <Button variant="link" size="sm">
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
