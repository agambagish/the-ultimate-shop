import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";

interface Props {
  children: React.ReactNode;
}

export function HomeLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
