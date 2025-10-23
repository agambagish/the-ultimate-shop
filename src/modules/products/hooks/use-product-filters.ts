import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

import { sortValues } from "../lib/constants";

const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("new"),
  minPrice: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  maxPrice: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  tags: parseAsArrayOf(parseAsString).withOptions({
    clearOnDefault: true,
  }),
};

export function useProductFilters() {
  return useQueryStates(params);
}
