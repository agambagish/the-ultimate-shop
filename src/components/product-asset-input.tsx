"use client";

import { CloudUploadIcon, XIcon } from "lucide-react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface Props<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  disabled?: boolean;
  form: UseFormReturn<T>;
}

export function ProductAssetInput<T extends FieldValues>({
  form,
  field,
  disabled,
}: Props<T>) {
  return (
    <FileUpload
      value={field.value}
      onValueChange={field.onChange}
      accept="image/svg+xml, image/png, application/pdf, application/postscript, image/vnd.adobe.photoshop, application/zip, application/x-zip-compressed"
      maxFiles={1}
      maxSize={30 * 1024 * 1024}
      disabled={disabled}
      onFileReject={(_, message) => form.setError(field.name, { message })}
    >
      <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
        <CloudUploadIcon className="size-4" /> Drag & drop or{" "}
        <FileUploadTrigger asChild>
          <Button variant="link" size="sm" className="p-0">
            Choose File
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {field.value.map((file: File, i: number) => (
          <FileUploadItem key={i} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <XIcon />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
