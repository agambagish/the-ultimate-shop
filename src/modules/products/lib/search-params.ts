import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { sortValues } from "./constants";

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

export const loadProductFilters = createLoader(params);
