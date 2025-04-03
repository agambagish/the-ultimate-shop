import type { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return <SignIn />;
}
