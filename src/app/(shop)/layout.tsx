import { Footer } from "@/features/layouts/components/footer";
import { Header } from "@/features/layouts/components/header";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
