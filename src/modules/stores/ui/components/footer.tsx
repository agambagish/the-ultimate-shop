import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t bg-white font-medium">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <p className="font-semibold text-muted-foreground text-xl tracking-tight">
          Powered by
        </p>
        <Logo className="w-56" />
      </div>
    </footer>
  );
}
