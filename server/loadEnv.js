/** Load repo-root `.env` before other imports (imported first from `server.js`). */
import dotenv from "dotenv";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env");

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
