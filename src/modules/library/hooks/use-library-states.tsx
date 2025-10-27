import { parseAsBoolean, useQueryStates } from "nuqs";

export function useLibraryStates() {
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });
}
