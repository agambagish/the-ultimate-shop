import { useParams, usePathname } from "next/navigation";

export function useBreadcrumbs() {
  const { storeId } = useParams<{ storeId: string }>();
  const pwod = usePathname().split("/").slice(3);

  const breadcrumbs = [
    { label: "dashboard", url: `/dashboard/${storeId}` },
    ...pwod.map((b) => ({
      label: b.replaceAll("-", " "),
      url: `/dashboard/${storeId}/${b}`,
    })),
  ];

  return { breadcrumbs };
}
