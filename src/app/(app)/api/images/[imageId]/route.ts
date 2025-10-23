import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/env";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  const { imageId } = await params;
  const image = await prisma.media.findUnique({
    where: { id: Number(imageId) },
  });

  const res = await fetch(
    `${env.NEXT_PUBLIC_APP_URL}/api/media/file/${image?.filename}`,
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
