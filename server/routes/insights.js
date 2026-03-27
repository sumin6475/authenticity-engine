import express from "express";
import Capture from "../models/Capture.js";
import { AE_SYSTEM_PROMPT } from "../services/prompts.js";
import OpenAI from "openai";

const router = express.Router();

// 지연 초기화 — 모듈 로드 시점에는 OPENAI_API_KEY가 아직 없을 수 있음
let openaiClient = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

router.get("/who-youre-becoming", async (req, res) => {
  try {
    //1. 최근 캡쳐 가져오기 (최대 20개)
    const recentCaptures = await Capture.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select("title content tags category summary createdAt");

    if (recentCaptures.length < 3) {
      return res.json({
        success: true,
        data: {
          message:
            "Not enough captures to generate an insight; at least 3 captures are required.",
        },
      });
    }

    //2. 캡쳐들을 context 문자열로 조합
    const context = recentCaptures
      .map(
        (c, i) =>
          `[${i + 1}] ${c.title} | Tags: ${c.tags?.join(", ")} | ${c.summary || c.content.slice(0, 200)}`,
      )
      .join("\n");

    //3. RAG: context + System Prompt → Responses API
    const response = await getOpenAI().responses.create({
      model: "gpt-4o-mini",
      instructions: AE_SYSTEM_PROMPT,
      input: `Here are this person's recent captures:\n\n${context}\n\nBased on these, describe the patterns you notice in what they're drawn to. What themes are emerging? What might they be becoming?`,
      max_output_tokens: 600,
    });

    res.json({
      success: true,
      data: {
        analysis: response.output_text,
        captureCount: recentCaptures.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
