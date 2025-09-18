import { Footer } from "./footer";
import { Navbar } from "./navbar";

export default function ({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
