import { Footer } from "@/modules/home/ui/components/footer";

import { DashboardNavbar } from "../components/dashboard-navbar";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
