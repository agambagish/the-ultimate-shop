import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";

import { products } from "@/db/schema";
import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/features/data-table/lib/parsers";

export const productsTableParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<typeof products.$inferSelect>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.enum(products.status.enumValues)).withDefault([]),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
