import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

export default function Layout({ children }: React.PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
