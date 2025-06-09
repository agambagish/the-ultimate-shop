import type { OnboardingSchema } from "../schemas/onboarding-schema";

export interface Step {
  step: number;
  title: string;
  description: string;
  fields: (keyof OnboardingSchema)[];
}
