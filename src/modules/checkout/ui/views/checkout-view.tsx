"use client";

interface Props {
  storeSubdomain: string;
}

export function CheckoutView({ storeSubdomain }: Props) {
  return <div>{storeSubdomain}</div>;
}
