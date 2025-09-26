import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(24, "Subdomain must be less than 64 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Subdomain can only contain lowercase letters, numbers & hyphens. It must start and ends with a letter or number",
    )
    .refine(
      (value) => !value.includes("--"),
      "Subdomain can't contain consecutive hyphens",
    )
    .transform((value) => value.toLowerCase()),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
