"use client";

import { useTransition } from "react";

import type { Row } from "@tanstack/react-table";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { products } from "@/db/schema";
import { deleteProducts } from "@/features/dashboard/actions/product";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  products: Row<typeof products.$inferSelect>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteProductsDialog({
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    startTransition(async () => {
      const { error } = await deleteProducts({
        productIds: products.map((p) => p.id),
      });

      if (error) {
        toast.error(error);
        return;
      }

      props.onOpenChange?.(false);
      toast.success("Product(s) deleted");
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <TrashIcon className="mr-2 size-4" />
              Delete ({products.length})
            </Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{products.length}</span>
              {products.length === 1 ? " product" : " products"} from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isPending}
            >
              {isPending && <Loader2Icon className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
