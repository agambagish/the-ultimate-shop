import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { tryCatch } from "@/lib/try-catch";

import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";

interface Props {
  children: React.ReactNode;
}

export async function HomeLayout({ children }: Props) {
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
