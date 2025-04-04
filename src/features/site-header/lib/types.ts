export interface NavItem {
  type: "item" | "list";
  label: string;
  url?: string;
  children:
    | (Omit<NavItem, "children" | "type"> & {
        description?: string | React.ReactNode;
      })[]
    | [];
}

export type MenuListItem = Omit<NavItem, "children" | "type"> & {
  description?: string | React.ReactNode;
};
