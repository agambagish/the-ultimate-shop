import type { NavItem } from "@/features/site-header/lib/types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Shop",
    type: "list",
    children: [
      {
        label: "Men's",
        url: "#",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      },
      {
        label: "Women's",
        url: "#",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      },
      {
        label: "Kid's",
        url: "#",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      },
    ],
  },
  {
    label: "On Sale",
    type: "item",
    url: "#",
    children: [],
  },
];
