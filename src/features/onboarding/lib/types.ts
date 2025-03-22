import type { OnboardingSchema } from "@/features/onboarding/lib/onboarding-schema";

export interface Step {
  title: string;
  description: string;
  fields: (keyof OnboardingSchema)[];
}
