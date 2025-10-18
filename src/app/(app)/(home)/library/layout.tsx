import { redirect } from "next/navigation";

import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function ({ children }: React.PropsWithChildren) {
  const session = await caller.auth.session();

  if (!session.user) {
    redirect("/login");
  }

  return children;
}
