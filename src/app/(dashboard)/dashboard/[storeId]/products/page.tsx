import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

interface Props {
  params: Promise<{ storeId: string }>;
}

export default async function Page({ params }: Props) {
  const { storeId } = await params;

  return (
    <div className="flex h-[48rem] flex-col items-center justify-center">
      <code>{JSON.stringify({})}</code>
      <Link
        href={`/dashboard/${storeId}/products/new`}
        className={buttonVariants()}
      >
        New
      </Link>
    </div>
  );
}
