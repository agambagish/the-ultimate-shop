import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4.5rem)] items-center justify-center">
      <Loader2Icon className="text-muted-foreground size-10 animate-spin" />
    </div>
  );
}
