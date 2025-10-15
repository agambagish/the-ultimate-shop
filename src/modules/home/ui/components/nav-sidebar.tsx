import Link from "next/link";

import { Logo } from "@/components/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSession } from "@/hooks/use-session";

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  items: NavItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavSidebar({ items, open, onOpenChange }: Props) {
  const { session } = useSession();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="hidden" />
          <Logo className="w-56" onClick={() => onOpenChange(!open)} />
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-secondary"
              onClick={() => onOpenChange(false)}
            >
              {item.label}
            </Link>
          ))}
          {!session.data?.user && (
            <div className="border-t">
              <Link
                href="/login"
                className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-secondary"
                onClick={() => onOpenChange(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-secondary"
                onClick={() => onOpenChange(false)}
              >
                Register
              </Link>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
