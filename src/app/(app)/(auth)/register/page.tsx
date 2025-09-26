import { redirect } from "next/navigation";

import { RegisterView } from "@/modules/auth/ui/views/register-view";
import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function () {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }

  return <RegisterView />;
}
