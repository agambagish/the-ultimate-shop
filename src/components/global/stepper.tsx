import { CheckIcon } from "lucide-react";

import type { Step } from "@/features/onboarding/lib/types";
import { cn } from "@/lib/utils";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  activeStep: number;
  orientation?: "horizontal" | "vertical";
}

function Stepper({
  ref,
  steps,
  activeStep,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isCurrent = index === activeStep;

        return (
          <div
            key={index}
            className={cn(
              "flex",
              orientation === "horizontal"
                ? "flex-col items-center"
                : "flex-row items-start",
              orientation === "horizontal" &&
                index !== steps.length - 1 &&
                "flex-1"
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    orientation === "horizontal"
                      ? "h-[2px] w-full flex-1"
                      : "ml-4 h-full w-[2px] flex-1",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
            <div
              className={cn(
                "mt-2",
                orientation === "horizontal" ? "text-center" : "ml-4"
              )}
            >
              <div
                className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </div>
              {step.description && (
                <div className="text-muted-foreground text-xs">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Stepper.displayName = "Stepper";

export { Stepper };
