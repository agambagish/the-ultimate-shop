/* eslint-disable no-console */
/* eslint-disable n/no-process-env */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    EDGE_STORE_ACCESS_KEY: z.string(),
    EDGE_STORE_SECRET_KEY: z.string(),
    PAYU_SALT: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_PAYU_KEY: z.string(),
    NEXT_PUBLIC_NGROK_URL: z.string().url().optional(),
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
    EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
    PAYU_SALT: process.env.PAYU_SALT,
    NEXT_PUBLIC_PAYU_KEY: process.env.NEXT_PUBLIC_PAYU_KEY,
    NEXT_PUBLIC_NGROK_URL: process.env.NEXT_PUBLIC_NGROK_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
  onValidationError: (issues) => {
    console.error(
      "❌ Invalid env variables:",
      JSON.stringify(
        issues.map(
          (i) => `${[i.path?.[0] as string]} = ${i.message.toLowerCase()}`
        ),
        null,
        2
      )
    );
    process.exit(1);
  },
  onInvalidAccess: () => {
    console.error(
      "❌ Attempted to access a server-side environment variable on the client"
    );
    process.exit(1);
  },
});
