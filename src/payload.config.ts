// storage-adapter-import-placeholder

import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Categories } from "./collections/categories";
import { Media } from "./collections/media";
import { Orders } from "./collections/orders";
import { Products } from "./collections/products";
import { Reviews } from "./collections/reviews";
import { Stores } from "./collections/stores";
import { Tags } from "./collections/tags";
import { Users } from "./collections/users";
import { env } from "./env";
import { isSuperAdmin } from "./lib/access";
import {
  computeSchemaHash,
  readStoredHash,
  storeHash,
} from "./lib/hash-schema";
import { exec } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Stores,
    Orders,
    Reviews,
  ],
  cookiePrefix: "tus",
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
  }),
  onInit: (payload) => {
    payload.logger.info("Checking schema hash for Prisma sync...");

    const schemaFiles = ["src/payload-types.ts"];
    const hashFile = ".schema_hash";

    const newHash = computeSchemaHash(schemaFiles);
    const oldHash = readStoredHash(hashFile);

    if (newHash === oldHash) {
      payload.logger.info("No schema changes detected. Skipping Prisma sync.");
      return;
    }

    payload.logger.info("Schema changes detected. Running Prisma sync...");

    exec("pnpm prisma:sync", (error, stdout, stderr) => {
      if (error) {
        payload.logger.error(`Failed to run Prisma sync: ${error.message}`);
        return;
      }
      if (stderr) payload.logger.warn(stderr);
      payload.logger.info(stdout);

      storeHash(hashFile, newHash);
    });
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      tenantsSlug: "stores",
      collections: {
        products: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    // storage-adapter-placeholder
  ],
});
