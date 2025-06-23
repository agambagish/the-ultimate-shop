import { initEdgeStoreClient } from "@edgestore/server/core";

import { edgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";

export const edgestore = initEdgeStoreClient({
  router: edgeStoreRouter,
});
