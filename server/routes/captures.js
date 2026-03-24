//capture 관련 API 라우트
import express from "express";
import Capture from "../models/Capture.js";
import fetchArticle from "../services/fetchArticle.js";
import { analyzeCaptureText } from "../services/analyzeCaptureText.js";

const router = express.Router();

//모든 캡쳐 가져오기
router.get("/", async (req, res) => {
    try {
    //최신순으로 정렬해서 가져오기
    const captures = await Capture.find().sort({ createdAt: -1 });
    res.json({ success: true, data: captures});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message});
    }
});

//새 캡쳐 저장하기
router.post("/", async (req, res) => {
    try {
        const { title, content, type } = req.body;

        // 스키마: idea | link 만 허용 (잘못된 값은 idea로 정규화)
        const captureType = type === "link" ? "link" : "idea";
        // AI 분석
        let tags = [];
        let category = "";
        let summary = ""; 

        if (content){
            const aiResult = await analyzeCaptureText(content);
            tags = aiResult.tags;
            category = aiResult.category;
            summary = aiResult.summary;
        }
        const capture = await Capture.create({
            title,
            content,
            type: captureType,
            tags,
            category,
            summary,
        });

        res.status(201).json({ success: true, data: capture});
    } catch (error) {
        res.status(400).json({ success: false, error: error.message});
    }
});

// URL -> 파싱 -> AI 분석 -> 저장
router.post("/from-url", async(req, res)=> {
    try {
        const {url, note} = req.body;
        if(!url) {
            return res.status(400).json({success: false, error: "URL is required"});
        }
        //1. 파싱
        const article = await fetchArticle(url);

        //2. AI 분석
        const aiResult = await analyzeCaptureText(article.textContent);

        //3. 저장
        const capture = await Capture.create({
            title: article.title,
            content: article.textContent,
            type: "link",
            url,
            note: note || "",
            tags: aiResult.tags,
            category: aiResult.category,
            summary: aiResult.summary,
        });
        res.status(201).json({success: true, data: capture});

    
    } catch (error) {
        console.error("Error in from-url capture:", error);
        res.status(400).json({success: false, error: error.message});
    }
});

export default router;