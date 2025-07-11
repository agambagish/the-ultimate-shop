import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex h-18 justify-between border-t p-6 font-medium">
      <div className="flex items-center">
        <p>The Ult. Shop</p>
      </div>
      <div className="text-muted-foreground flex items-center space-x-4 text-sm">
        <Link href="/terms" className="hover:text-foreground">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
