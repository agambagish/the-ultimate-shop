import Link from "next/link";
import { Fragment } from "react";

import { AlignLeftIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/features/site-header/lib/config";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer">
        <AlignLeftIcon className="text-muted-foreground size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle asChild>
            <SheetClose asChild>
              <Link href="/" className="px-2 text-2xl">
                <span className="font-extrabold">Shop</span>
              </Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-start p-6 pt-0">
          {NAV_ITEMS.map((item, i) => (
            <Fragment key={i}>
              {item.type === "item" && (
                <SheetClose asChild>
                  <Link href={item.url ?? "/"} className="mb-4 font-medium">
                    {item.label}
                  </Link>
                </SheetClose>
              )}
              {item.type === "list" && (
                <div className="mb-4 w-full">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={item.label} className="border-none">
                      <AccordionTrigger className="cursor-pointer p-0 py-0.5 text-left text-base font-medium">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col border-l p-4 pb-0">
                        {item.children.map((itemChild, i) => (
                          <SheetClose
                            key={i}
                            asChild
                            className="w-fit py-2 text-base"
                          >
                            <Link href={itemChild.url ?? "/"}>
                              {itemChild.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
