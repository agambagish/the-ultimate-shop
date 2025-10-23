import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { sortValues } from "../../lib/constants";

interface Props {
  value: (typeof sortValues)[number];
  onChange: (value: (typeof sortValues)[number]) => void;
}

export function SortFilter({ value, onChange }: Props) {
  return (
    <RadioGroup value={value}>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="new" onClick={() => onChange("new")} />
        <Label>Newest</Label>
      </div>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="lth" onClick={() => onChange("lth")} />
        <Label>Price Low-to-High</Label>
      </div>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="htl" onClick={() => onChange("htl")} />
        <Label>Price High-to-Low</Label>
      </div>
    </RadioGroup>
  );
}
