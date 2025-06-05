import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

export default function Layout({ children }: React.PropsWithChildren) {
  return <HomeLayout>{children}</HomeLayout>;
}
