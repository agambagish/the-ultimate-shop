import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/stores/ui/components/footer";

interface Props extends React.PropsWithChildren {
  params: Promise<{ subdomain: string }>;
}

export default async function ({ children, params }: Props) {
  const { subdomain } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar subdomain={subdomain} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
