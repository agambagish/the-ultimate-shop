import { Fragment, Suspense } from "react";

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuItem } from "@/features/layouts/components/menu-item";
import { MenuList } from "@/features/layouts/components/menu-list";
import { getNavItems } from "@/features/layouts/lib/config";

export async function MainNav() {
  const navItems = await getNavItems();

  return (
    <NavigationMenu className="flex items-start justify-start">
      <NavigationMenuList>
        {navItems.map((item, i) => (
          <Suspense key={i} fallback={<Skeleton className="h-9 w-20" />}>
            <Fragment>
              {item.type === "item" && (
                <MenuItem label={item.label} url={item.url} />
              )}
              {item.type === "list" && (
                <MenuList items={item.children} label={item.label} />
              )}
            </Fragment>
          </Suspense>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
