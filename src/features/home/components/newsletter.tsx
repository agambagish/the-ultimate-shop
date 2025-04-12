import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="w-full px-4 py-16 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
          Subscribe to Our Newsletter
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-gray-600">
          Stay updated with our latest products, exclusive offers, and fashion
          trends delivered straight to your inbox.
        </p>
        <div className="mx-auto max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-grow">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-11 w-full"
              />
            </div>
            <Button type="submit" className="h-11 px-6 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates from our company.
        </p>
      </div>
    </section>
  );
}
