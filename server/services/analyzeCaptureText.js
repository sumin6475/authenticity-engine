import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { captureAiOutputSchema } from "../schemas/captureAiOutput.js";

const MAX_CHARS = 12000;

// 모듈 최상단에서 new OpenAI() 하면 dotenv보다 먼저 로드될 때 키가 비어 있음 → 첫 호출 시 생성
let openaiClient = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Readability 등에서 나온 본문 → tags / category / summary
 */
export async function analyzeCaptureText(plainText) {
  const text = (plainText || "").slice(0, MAX_CHARS).trim();
  if (!text) {
    return { tags: [], category: "", summary: "" };
  }

  try {
    const completion = await getOpenAI().chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You label saved reading material for a personal knowledge app. " +
            "Respond only in the required JSON shape. Use concise tags (1–2 words). " +
            "Category is a short theme. Summary is 2–4 sentences in the same language as the text when possible.",
        },
        { role: "user", content: text },
      ],
      response_format: zodResponseFormat(captureAiOutputSchema, "capture_ai_output"),
    });

    const msg = completion.choices[0]?.message;

    if (msg?.refusal) {
      console.warn("OpenAI refusal:", msg.refusal);
      return { tags: [], category: "", summary: "" };
    }

    if (!msg?.parsed) {
      return { tags: [], category: "", summary: "" };
    }

    return {
      tags: msg.parsed.tags,
      category: msg.parsed.category,
      summary: msg.parsed.summary,
    };
  } catch (e) {
    console.error("analyzeCaptureText:", e);
    return { tags: [], category: "", summary: "" };
  }
}

export default analyzeCaptureText;