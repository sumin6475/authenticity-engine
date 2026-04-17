/**
 * `/api/captures` — paginated list, by id, vector similar, create capture, create from URL.
 */
import express from "express";
import Capture from "../models/Capture.js";
import fetchArticle from "../services/fetchArticle.js";
import { analyzeCaptureText } from "../services/analyzeCaptureText.js";
import { generateEmbedding } from "../services/embedding.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = page === 1 ? 10 : 5;
        const skip = page === 1 ? 0 : 10 + (page -2 ) * 5;
        
        const captures = await Capture.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
        const total = await Capture.countDocuments();
        res.json({ success: true, data: captures, hasMore: skip + captures.length < total,});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const capture = await Capture.findById(req.params.id);
        if(!capture){
            return res.status(404).json({success: false, error: "Capture not found"});
        }
        res.json({success: true, data: capture});
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
})

router.get("/similar/:id", async (req, res) => {
    try{
        const capture = await Capture.findById(req.params.id);
        // 임베딩이 없는 캡처는 "유사 결과 없음"이므로 에러 대신 빈 배열을 반환한다.
        if(!capture || !capture.embedding.length){
            return res.json({success: true, data: []});
        }
        const results = await Capture.aggregate([
            {$vectorSearch :{
                index: "vector_index",
                path: "embedding",
                queryVector: capture.embedding,
                numCandidates: 50,
                limit: 5,
            }
        },{
            $match:{_id: {$ne: capture._id}}
        },{
            $project:{
                title: 1, content: 1, tags: 1, category: 1, summary:1, createdAt: 1, score:{$meta: "vectorSearchScore"}
            }
        }
        ]);
        res.json({success: true, data: results});
    }catch(error){
        res.status(500).json({success: false, error: error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, content, type } = req.body;

        const captureType = type === "link" ? "link" : "idea";
        let tags = [];
        let category = "";
        let summary = "";  

        if (content){
            const aiResult = await analyzeCaptureText(content);
            tags = aiResult.tags;
            category = aiResult.category;
            summary = aiResult.summary;
        }
        const textForEmbedding = `${title} ${content}`;
        const embedding = await generateEmbedding(textForEmbedding);

        const capture = await Capture.create({
            title,
            content,
            type: captureType,
            tags,
            category,
            summary,
            embedding,
        });

        res.status(201).json({ success: true, data: capture});
    } catch (error) {
        res.status(400).json({ success: false, error: error.message});
    }
});

router.post("/from-url", async(req, res)=> {
    try {
        const {url, note} = req.body;
        if(!url) {
            return res.status(400).json({success: false, error: "URL is required"});
        }
        const article = await fetchArticle(url);

        const aiResult = await analyzeCaptureText(article.textContent);

        const textForEmbedding = `${article.title} ${article.textContent}`;
        const embedding = await generateEmbedding(textForEmbedding);

        const capture = await Capture.create({
            title: article.title,
            content: article.textContent,
            type: "link",
            url,
            thumbnail: article.thumbnail || "",
            note: note || "",
            tags: aiResult.tags,
            category: aiResult.category,
            summary: aiResult.summary,
            embedding,
        });
        res.status(201).json({success: true, data: capture});

    
    } catch (error) {
        console.error("Error in from-url capture:", error);
        res.status(400).json({success: false, error: error.message});
    }
});

export default router;