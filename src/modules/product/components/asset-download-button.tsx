"use client";

import { useEffect, useState } from "react";

import { DownloadIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { getAssetLink } from "../server/get-asset-link";

interface Props {
  slug: string;
  assetCID: string;
}

export function AssetDownloadButton({ assetCID, slug }: Props) {
  const [link, setLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const result = await getAssetLink({ assetCID, slug });
        setLink(result);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [assetCID, slug]);

  async function onDownload() {
    setIsLoading(true);

    const res = await fetch(link ?? "");
    const blob = await res.blob();
    const blobURL = window.URL.createObjectURL(blob);
    const anchorTag = document.createElement("a");

    anchorTag.href = blobURL;
    anchorTag.download = "my-file";
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
    window.URL.revokeObjectURL(blobURL);

    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2Icon className="animate-spin" />
        Loading
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={!!link ? "outline" : "ghost"}
      disabled={!link}
      onClick={onDownload}
      className={cn("cursor-pointer", !link && "cursor-not-allowed")}
    >
      <DownloadIcon className="h-4 w-4" />
      {!!link ? "Download" : "Locked"}
    </Button>
  );
}
