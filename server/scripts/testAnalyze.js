import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

const { analyzeCaptureText } = await import("../services/analyzeCaptureText.js");

const testText = `
    The quick brown fox jumps over the lazy dog.
    The quick brown fox jumps over the lazy dog.`;

const result = await analyzeCaptureText(testText.trim());
console.log(JSON.stringify(result, null, 2));
