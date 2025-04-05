import Link from "next/link";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { MenuListItem } from "@/features/site-header/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  items: MenuListItem[];
  label: string;
}

export function MenuList({ label, items }: Props) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="px-3 font-medium">
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {items.map((item, i) => (
            <ListItem
              key={i}
              title={item.label}
              href={item.url ?? "/"}
              className="truncate"
            >
              {item.description ?? ""}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function ListItem(
  {
    className,
    title,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Link>,
  ref?: React.Ref<React.ElementRef<typeof Link>>
) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

ListItem.displayName = "ListItem";
