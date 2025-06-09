import type { Step } from "../lib/types";

export const steps: Step[] = [
  {
    step: 1,
    title: "Store Info",
    description: "Set up your online store",
    fields: ["name", "description", "slug"],
  },
  {
    step: 2,
    title: "Address",
    description: "Provide your address",
    fields: [
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "country",
      "pinCode",
    ],
  },
  {
    step: 3,
    title: "Review Application",
    description: "Review your information before proceeding to verification",
    fields: [],
  },
];
