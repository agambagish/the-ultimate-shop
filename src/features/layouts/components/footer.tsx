import Link from "next/link";

import {
  GithubIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TwitterIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { getFeaturedCategories } from "@/features/home/queries";

export async function Footer() {
  const { categories } = await getFeaturedCategories();

  return (
    <footer className="w-full bg-gray-100 px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">The Ultimate Shop</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="mt-0.5 h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-600">
                  15 Park Street, Kolkata, India
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-600">+91 95555 17764</p>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-600">
                  theultimateshop@gmail.com
                </p>
              </div>
            </div>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://x.com/MacherJholBhaat"
                target="_blank"
                className="text-gray-600 transition-colors hover:text-blue-400"
              >
                <TwitterIcon className="size-5" />
              </Link>
              <Link
                href="https://github.com/agambagish"
                target="_blank"
                className="text-gray-600 transition-colors hover:text-gray-800"
              >
                <GithubIcon className="size-5" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shop</h3>
            <ul className="space-y-2">
              {categories.map((c, i) => (
                <li key={i}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/returns-n-exchanges"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-gray-300" />
        <div className="flex flex-col items-center justify-between text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} The Ultimate Shop. All rights
            reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="#" className="transition-colors hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-gray-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
