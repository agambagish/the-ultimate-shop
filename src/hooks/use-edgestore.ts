import { useState } from "react";

import { toast } from "sonner";

import type { EdgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";
import { useEdgeStore } from "@/providers/edgestore-provider";

export function useEdgestore() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { edgestore } = useEdgeStore();

  async function uploadFiles({
    endpoint,
    files,
  }: {
    endpoint: keyof EdgeStoreRouter["buckets"];
    files: File[];
  }) {
    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const { url } = await edgestore[endpoint].upload({
          file,
        });

        return url;
      });

      return await Promise.all(uploadPromises);
    } catch {
      toast.error("Unable to upload images");
      return [];
    } finally {
      setIsUploading(false);
    }
  }

  async function replaceFile({
    endpoint,
    file,
    oldFileURL,
  }: {
    endpoint: keyof EdgeStoreRouter["buckets"];
    file: File[];
    oldFileURL: string;
  }) {
    setIsUploading(true);

    try {
      const { url } = await edgestore[endpoint].upload({
        file: file[0],
        options: {
          replaceTargetUrl: oldFileURL,
        },
      });

      return [url];
    } catch {
      toast.error("Unable to upload images");
      return [];
    } finally {
      setIsUploading(false);
    }
  }

  return {
    uploadFiles,
    replaceFile,
    isUploading,
  };
}
