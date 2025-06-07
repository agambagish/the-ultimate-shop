import Link from "next/link";

import { AlignRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarItem {
  href: string;
  title: string;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isStoreOwner: boolean;
}

export function NavbarSidebar({
  items,
  open,
  onOpenChange,
  isStoreOwner,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <AlignRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item, i) => (
            <Link
              key={i}
              {...item}
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              {item.title}
            </Link>
          ))}
          {!isStoreOwner && (
            <div className="border-t">
              <Link
                href="/onboarding"
                className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                Start Selling
              </Link>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
