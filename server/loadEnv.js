// server.js보다 먼저 import 해야 함 — ESM은 다른 import보다 먼저 이 모듈이 평가되도록 server.js 맨 위에 둠
import dotenv from "dotenv";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env");

// Railway 등에는 .env 파일이 없음 → dotenv 생략 (Variables 가 process.env 에 직접 들어감)
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
