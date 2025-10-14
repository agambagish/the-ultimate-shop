import z from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(3, "Full Name must be at least 3 characters long")
    .max(64, "Full Name must be at most 64 characters long"),
  email: z.email("Must be a valid email"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
    ),
});

export const loginSchema = z.object({
  email: z.email("Must be a valid email"),
  password: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
