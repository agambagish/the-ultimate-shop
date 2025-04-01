import { unstable_cache as next_unstable_cache } from "next/cache";
import { cache } from "react";

export function unstable_cache<Inputs extends unknown[], Output>(
  cb: (...args: Inputs) => Promise<Output>,
  keyParts: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
) {
  return cache(next_unstable_cache(cb, keyParts, options));
}
