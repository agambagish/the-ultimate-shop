import { redirect } from "next/navigation";

import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function ({ children }: React.PropsWithChildren) {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className="h-screen w-full overflow-y-auto md:col-span-3">
        {children}
      </div>
      <div
        className="hidden h-screen w-full md:col-span-2 md:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
