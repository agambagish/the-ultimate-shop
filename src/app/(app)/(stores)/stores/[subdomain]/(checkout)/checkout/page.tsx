import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function ({ params }: Props) {
  const { subdomain } = await params;

  return (
    <main className="min-h-screen">
      <CheckoutView storeSubdomain={subdomain} />
    </main>
  );
}
