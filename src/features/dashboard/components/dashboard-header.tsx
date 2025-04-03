"use client";

import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumb";

export function DashboardHeader() {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((b, i) => (
              <Fragment key={i}>
                <BreadcrumbItem>
                  {i + 1 === breadcrumbs.length ? (
                    <BreadcrumbPage className="capitalize">
                      {b.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={b.url} className="capitalize">
                      {b.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i + 1 < breadcrumbs.length && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
