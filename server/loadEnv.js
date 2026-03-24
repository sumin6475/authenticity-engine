// server.js보다 먼저 import 해야 함 — ESM은 다른 import보다 먼저 이 모듈이 평가되도록 server.js 맨 위에 둠
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });
