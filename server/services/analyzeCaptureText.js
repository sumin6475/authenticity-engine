import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { captureAiOutputSchema } from "../schemas/captureAiOutput.js";

const MAX_CHARS = 12000;

let openaiClient = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/** Labels capture body text: tags, category, summary (OpenAI Responses + zod). */
export async function analyzeCaptureText(plainText) {
  const text = (plainText || "").slice(0, MAX_CHARS).trim();
  if (!text) {
    return { tags: [], category: "", summary: "" };
  }

  try {
    const response = await getOpenAI().responses.parse({
      model: "gpt-4o-mini",
      instructions:
        "You label saved reading material for a personal knowledge app. " +
        "Respond only in the required JSON shape. Use concise tags (1–2 words). " +
        "Category is a short theme. Summary is 2–4 sentences in the same language as the text when possible.",
      input: text,
      text: {
        format: zodTextFormat(captureAiOutputSchema, "capture_ai_output"),
      },
    });

    const parsed = response.output_parsed;
    if (!parsed) {
      return { tags: [], category: "", summary: "" };
    }

    return {
      tags: parsed.tags,
      category: parsed.category,
      summary: parsed.summary,
    };
  } catch (e) {
    console.error("analyzeCaptureText:", e);
    return { tags: [], category: "", summary: "" };
  }
}

export default analyzeCaptureText;