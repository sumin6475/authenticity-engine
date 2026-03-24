import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// cwd와 무관하게 프로젝트 루트 .env 로드 (…/Authenticity Engine/.env)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

// dotenv 이후에 서비스 로드 → OpenAI 클라이언트가 키를 읽을 수 있음
const { analyzeCaptureText } = await import("../services/analyzeCaptureText.js");

const testText = `
    The quick brown fox jumps over the lazy dog.
    The quick brown fox jumps over the lazy dog.`;

const result = await analyzeCaptureText(testText.trim());
console.log(JSON.stringify(result, null, 2));
