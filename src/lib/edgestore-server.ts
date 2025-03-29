import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { initEdgeStoreClient } from "@edgestore/server/core";

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  productImages: es.imageBucket({
    maxSize: 1024 * 1024 * 4,
    accept: ["image/*"],
  }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export const esBackendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
