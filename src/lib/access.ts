import type { ClientUser } from "payload";

import type { User } from "@/payload-types";

export function isSuperAdmin(user: User | ClientUser | null) {
  return Boolean(user?.roles?.includes("super_admin"));
}
