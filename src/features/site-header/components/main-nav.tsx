import { Fragment } from "react";

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "@/features/site-header/components/menu-item";
import { MenuList } from "@/features/site-header/components/menu-list";
import { getNavItems } from "@/features/site-header/lib/config";

export async function MainNav() {
  const navItems = await getNavItems();

  return (
    <NavigationMenu className="flex items-start justify-start">
      <NavigationMenuList>
        {navItems.map((item, i) => (
          <Fragment key={i}>
            {item.type === "item" && (
              <MenuItem label={item.label} url={item.url} />
            )}
            {item.type === "list" && (
              <MenuList items={item.children} label={item.label} />
            )}
          </Fragment>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
