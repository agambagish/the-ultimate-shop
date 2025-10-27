import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_LIMIT } from "@/modules/tags/lib/constants";
import { useTRPC } from "@/trpc/client";

interface Props {
  values?: string[] | null;
  onChange: (value: string[]) => void;
}

export function TagsFilter({ values, onChange }: Props) {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.tags.length > 0 ? lastPage.nextPage : undefined,
        },
      ),
    );

  function onClick(tag: string) {
    if (values?.includes(tag)) {
      onChange(values.filter((t) => t !== tag) || []);
    } else {
      onChange([...(values || []), tag]);
    }
  }

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.tags.map((tag) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: _
            <div
              key={tag.id}
              className="flex cursor-pointer items-center space-x-3"
              onClick={() => onClick(tag.label)}
            >
              <Checkbox
                checked={values?.includes(tag.label)}
                onCheckedChange={() => onClick(tag.label)}
                className="border-border/60 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <Label className="flex-1 cursor-pointer text-sm capitalize transition-colors hover:text-primary">
                {tag.label}
              </Label>
            </div>
          )),
        )
      )}
      {hasNextPage && (
        <Button
          disabled={isFetchingNextPage}
          variant="link"
          size="sm"
          onClick={() => fetchNextPage()}
          className="mt-3 h-8 w-full cursor-pointer"
        >
          Show More
        </Button>
      )}
    </div>
  );
}
