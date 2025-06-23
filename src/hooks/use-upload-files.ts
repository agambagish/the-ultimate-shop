import { useState } from "react";

import { toast } from "sonner";

import type { EdgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";
import { useEdgeStore } from "@/providers/edgestore-provider";

export function useUploadFiles(endpoint: keyof EdgeStoreRouter["buckets"]) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { edgestore } = useEdgeStore();

  async function uploadFiles(files: File[]) {
    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const { url } = await edgestore[endpoint].upload({
          file,
          onProgressChange: (progress) => {
            setProgresses((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          },
        });

        setUploadedFiles((prev) => [...prev, url]);
        return url;
      });

      return await Promise.all(uploadPromises);
    } catch {
      toast.error("Unable to upload images");
      return [];
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles,
    isUploading,
  };
}
