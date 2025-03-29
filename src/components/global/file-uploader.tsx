"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FileTextIcon,
  GripHorizontalIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useControllableState } from "@/features/dashboard/hooks/use-controllable-state";
import { cn, formatBytes } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  maxFileCount?: DropzoneProps["maxFiles"];
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUploader(props: Props) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time");
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast.error(`Cannot upload more than ${maxFileCount} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }
    },
    [files, maxFileCount, multiple, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = files?.findIndex((file) => file.name === active.id);
    const newIndex = files?.findIndex((file) => file.name === over.id);
    setFiles(arrayMove(files!, oldIndex!, newIndex!));
  }

  useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={disabled || (files?.length ?? 0) >= maxFileCount}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={cn(
              "group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="rounded-full border border-dashed p-3">
                <UploadIcon className="text-muted-foreground size-7" />
              </div>
              <div className="flex flex-col gap-px">
                <p className="text-muted-foreground font-medium">
                  Drag {"'n'"} drop files here, or click to select files
                </p>
                <p className="text-muted-foreground/70 text-sm">
                  You can upload
                  {maxFileCount > 1
                    ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount}
                      files (up to ${formatBytes(maxSize)} each)`
                    : ` a file with ${formatBytes(maxSize)}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={files.map((file) => file.name)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {files?.map((file, index) => (
                <FileCard
                  key={file.name}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={progresses?.[file.name]}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}

function FileCard({
  file,
  progress,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
  progress?: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center gap-2.5"
    >
      <GripHorizontalIcon
        className="size-4 cursor-grab text-gray-500"
        {...listeners}
        {...attributes}
      />
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            className="rounded-md object-cover"
          />
        ) : (
          <FileTextIcon className="text-muted-foreground size-10" />
        )}
        <div className="flex w-full flex-col gap-2">
          <p className="text-foreground/80 line-clamp-1 text-sm font-medium">
            {file.name}
          </p>
          <p className="text-muted-foreground text-xs">
            {formatBytes(file.size)}
          </p>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-7"
        onClick={onRemove}
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}
