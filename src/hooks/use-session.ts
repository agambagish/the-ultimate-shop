import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function useSession() {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return { session };
}
