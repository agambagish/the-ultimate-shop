import type { ClientUser } from "payload";

import type { User } from "@/payload-types";

export function isSuperAdmin(user: User | ClientUser | null) {
  return Boolean(user?.role === "super_admin");
}

export function isSeller(user: User | ClientUser | null) {
  return Boolean(user?.role === "seller");
}
