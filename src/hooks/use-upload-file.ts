import { useState } from "react";

import { useEdgeStore } from "@/lib/edgestore";
import type { EdgeStoreRouter } from "@/lib/edgestore-server";

interface Props {
  route: keyof EdgeStoreRouter["buckets"];
}

export function useUploadFile({ route }: Props) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});

  const { edgestore } = useEdgeStore();

  async function uploadFiles(files: File[]) {
    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const { url } = await edgestore[route].upload({
          file,
          onProgressChange: (progress) => {
            setProgresses((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          },
          options: {
            temporary: true,
          },
        });

        return url;
      });

      return await Promise.all(uploadPromises);
    } catch {
      throw new Error("File upload error");
    } finally {
      setIsUploading(false);
      setProgresses({});
    }
  }

  return {
    uploadFiles,
    progresses,
    isUploading,
  };
}
