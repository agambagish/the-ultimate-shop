import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  activeCategoryLabel?: string | null;
  activeCategory?: string | null;
  activeSubcategoryLabel?: string | null;
}

export function BreadcrumbNav({
  activeCategory,
  activeCategoryLabel,
  activeSubcategoryLabel,
}: Props) {
  if (!activeCategoryLabel || activeCategory === "all") return null;

  return (
    <Breadcrumb className="mt-2 pl-4">
      <BreadcrumbList>
        {activeSubcategoryLabel ? (
          <>
            <BreadcrumbItem className="h-8">
              <BreadcrumbLink
                asChild
                className="font-medium text-muted-foreground text-sm underline"
              >
                <Link href={`/${activeCategory}`}>{activeCategoryLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="font-medium text-muted-foreground text-xs">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-muted-foreground text-sm">
                {activeSubcategoryLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-muted-foreground text-sm">
                {activeCategoryLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="font-medium text-muted-foreground text-xs">
              /
            </BreadcrumbSeparator>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
