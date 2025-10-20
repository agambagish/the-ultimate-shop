import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { StarPicker } from "@/components/star-picker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

interface Props {
  orderId: string;
  initialData?: inferRouterOutputs<AppRouter>["reviews"]["getOne"];
}

const formSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  description: z.string().min(1, "Description is required"),
});

export function ReviewForm({ orderId, initialData }: Props) {
  const [isPreview, setIsPreview] = useState<boolean>(!!initialData);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            orderId,
          }),
        );

        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            orderId,
          }),
        );

        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id.toString(),
        rating: values.rating,
        description: values.description,
      });
    } else {
      createReview.mutate({
        orderId,
        rating: values.rating,
        description: values.description,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your rating:" : "Liked it? Give it a rating"}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={
                    isPreview ||
                    createReview.isPending ||
                    updateReview.isPending
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Want to leave a written review?"
                  disabled={
                    isPreview ||
                    createReview.isPending ||
                    updateReview.isPending
                  }
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            type="submit"
            size="lg"
            disabled={
              createReview.isPending ||
              updateReview.isPending ||
              !form.formState.isDirty
            }
          >
            {createReview.isPending ||
              (updateReview.isPending && <Loader2 className="animate-spin" />)}
            {initialData ? "Update review" : "Post review"}
          </Button>
        )}
        {isPreview && (
          <Button onClick={() => setIsPreview(false)} size="lg" type="button">
            Edit
          </Button>
        )}
      </form>
    </Form>
  );
}
