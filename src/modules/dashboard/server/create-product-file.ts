"use server";

import mime from "mime-types";

import { db } from "@/db";
import { productFiles } from "@/db/schema";
import { pinata } from "@/lib/pinata";
import { tryCatch } from "@/lib/try-catch";

interface Props {
  file: File;
  slug: string;
}

export async function createProductFile({ file, slug }: Props) {
  const extension = mime.extension(file.type).toString();

  const upload = await pinata.upload.private
    .file(file)
    .name(`${crypto.randomUUID()}.${extension}`);

  const { data, error } = await tryCatch(
    db
      .insert(productFiles)
      .values({
        pinataCid: upload.cid,
        fileName: upload.name,
        mimeType: upload.mime_type,
        size: upload.size,
        productSlug: slug,
      })
      .returning({
        id: productFiles.id,
      })
  );

  if (error) {
    throw new Error("Something went wrong");
  }

  return data[0].id;
}
