import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function computeSchemaHash(files: string[]): string {
  let content = "";

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      content += fs.readFileSync(filePath, "utf8");
    }
  }

  return crypto.createHash("md5").update(content).digest("hex");
}

export function readStoredHash(hashFile: string): string | null {
  const filePath = path.join(process.cwd(), hashFile);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8");
  }
  return null;
}

export function storeHash(hashFile: string, hash: string) {
  const filePath = path.join(process.cwd(), hashFile);
  fs.writeFileSync(filePath, hash);
}
