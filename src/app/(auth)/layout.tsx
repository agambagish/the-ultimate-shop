import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

export default function Layout({ children }: React.PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>;
}
