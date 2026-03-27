import express from "express";
import Capture from "../models/Capture.js";
import { AE_SYSTEM_PROMPT } from "../services/prompts.js";
import OpenAI from "openai";
import { z } from "zod/v4";
import { zodTextFormat } from "openai/helpers/zod";

const router = express.Router();

// 지연 초기화 — 모듈 로드 시점에는 OPENAI_API_KEY가 아직 없을 수 있음
let openaiClient = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// Structured Output 스키마
const BecomingSchema = z.object({
  analysis: z.string(),
  identities: z.array(
    z.object({
      keyword: z.string(),
      description: z.string(),
      emoji: z.string(),
    }),
  ),
});

//Who You're Becoming Insight
router.get("/who-youre-becoming", async (req, res) => {
  try {
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

    const context = recentCaptures
      .map(
        (c, i) =>
          `[${i + 1}] ${c.title} | Tags: ${c.tags?.join(", ")} | ${c.summary || c.content.slice(0, 200)}`,
      )
      .join("\n");

    const response = await getOpenAI().responses.parse({
      model: "gpt-4o-mini",
      instructions: `${AE_SYSTEM_PROMPT}\n\nAlso generate exactly 2 identity keywords that capture this person's emerging type.\nkeyword: one evocative word (Architect, Dreamer, Connector, etc.)\ndescription: under 5 words explaining why\nemoji: one emoji that represents it`,
      input: `Here are this person's recent captures:\n\n${context}\n\nBased on these, describe the patterns you notice in what they're drawn to. What themes are emerging? What might they be becoming?`,
      text: {
        format: zodTextFormat(BecomingSchema, "becoming"),
      },
    });

    const parsed = response.output_parsed;

    res.json({
      success: true,
      data: {
        analysis: parsed.analysis,
        identities: parsed.identities,
        captureCount: recentCaptures.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Daily Insight
router.get("/daily-prompt", async(req,res)=>{
    try{
        const response = await getOpenAI().responses.create({
            model: "gpt-4o-mini",
            instructions:  "Generate one short, thought-provoking reflection question. No quotes, no attribution. Just the question. Keep it under 15 words.",
            input: `Today is ${new Date().toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"})}. Generate a reflection prompt.`,
            max_output_tokens: 50,
        });
        res.json({success: true, data: response.output_text});
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
});

//Memories
router.get("/memories", async(req,res)=> {
    try{
        //7일 이상된 캡쳐 중 랜덤 3개
        const onWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const memories = await Capture.aggregate([
            { $match: {createdAt: {$lt: onWeekAgo}}},
            { $sample: {size: 3}},
            { $project: {title: 1, summary:1, tags: 1, createdAt: 1}}
        ]);
        res.json({success: true, data: memories})
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
});

//Tag Frequency
router.get("/tag-frequency", async(req,res)=> {
    try{
        const result = await Capture.aggregate([
            {$unwind: "$tags"},
            {$group: {_id: "$tags", count: {$sum: 1}}},
            {$sort: {count: -1}},
            {$limit: 10}]);
            res.json({success: true, data: result});
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
});

export default router;
