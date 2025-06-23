import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

import { MAX_IMAGE_SIZE } from "@/lib/constants";

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
  thumbnailImages: es.imageBucket({
    accept: ["image/jpeg", "image/png"],
    maxSize: MAX_IMAGE_SIZE,
  }),
  productImages: es.imageBucket({
    accept: ["image/jpeg", "image/png"],
    maxSize: MAX_IMAGE_SIZE,
  }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
