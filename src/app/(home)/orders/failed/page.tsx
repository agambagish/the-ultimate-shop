import Link from "next/link";

import {
  AlertCircleIcon,
  HelpCircleIcon,
  PhoneIcon,
  RotateCcwIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircleIcon className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold">Payment Failed</h1>
        <p className="text-muted-foreground mt-2">
          Your payment couldn&apos;t be processed. Please try again.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Error</CardTitle>
          <CardDescription>
            There was an issue with your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
            <p className="mb-1 font-medium">
              Error: Payment could not be completed
            </p>
            <p>
              Your payment method was declined. Please try a different payment
              method or contact your bank.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium">Common Solutions:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <RotateCcwIcon className="text-muted-foreground mr-2 h-5 w-5 flex-shrink-0" />
                <span>Try again with the same payment method</span>
              </li>
              <li className="flex items-start">
                <HelpCircleIcon className="text-muted-foreground mr-2 h-5 w-5 flex-shrink-0" />
                <span>Verify your card details and billing information</span>
              </li>
              <li className="flex items-start">
                <PhoneIcon className="text-muted-foreground mr-2 h-5 w-5 flex-shrink-0" />
                <span>
                  Contact your bank to ensure transactions are allowed
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Need Help?</h3>
            <p className="text-muted-foreground text-sm">
              Our support team is available 24/7 to assist you with any payment
              issues.
            </p>
            <Button variant="link" className="mt-2 h-auto p-0 text-sm">
              Contact Support
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto"
            )}
          >
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            Try Again
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
