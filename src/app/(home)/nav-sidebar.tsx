import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t">
            <Link
              href="/login"
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="flex w-full items-center p-4 text-left font-medium text-base hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
