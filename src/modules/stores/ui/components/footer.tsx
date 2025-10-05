import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white font-medium">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xl">Powered by</p>
        <Link href="/">
          <span className="font-bold text-2xl">The Ultimate Shop</span>
        </Link>
      </div>
    </footer>
  );
}
