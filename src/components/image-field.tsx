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
import { MAX_IMAGE_SIZE } from "@/lib/constants";

interface Props<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  disabled: boolean;
  form: UseFormReturn<T>;
}

export function ImageField<T extends FieldValues>({
  field,
  disabled,
  form,
}: Props<T>) {
  return (
    <FileUpload
      value={field.value}
      onValueChange={field.onChange}
      accept="image/*"
      maxFiles={1}
      maxSize={MAX_IMAGE_SIZE}
      onFileReject={(_, message) => {
        form.setError(field.name, {
          message,
        });
      }}
      multiple={false}
      disabled={disabled}
    >
      <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
        <CloudUploadIcon className="size-4" />
        Drag and drop or
        <FileUploadTrigger asChild>
          <Button variant="link" size="sm" className="p-0">
            Choose File
          </Button>
        </FileUploadTrigger>
        to upload
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
