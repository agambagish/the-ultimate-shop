import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";
import { Footer } from "@/modules/layout/components/footer";
import { Navbar } from "@/modules/layout/components/navbar";

export default async function Layout({ children }: React.PropsWithChildren) {
  const { userId } = await auth();

  const { data: store } = await tryCatch(
    db.query.stores.findFirst({
      where: (f, o) => o.eq(f.userId, userId ?? ""),
      columns: { id: true },
    })
  );

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar isStoreOwner={!!store} />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
