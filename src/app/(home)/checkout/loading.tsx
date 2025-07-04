import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-9.5rem)] items-center justify-center">
      <Loader2Icon className="text-muted-foreground size-12 animate-spin" />
    </div>
  );
}
