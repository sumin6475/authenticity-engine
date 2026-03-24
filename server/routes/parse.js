import express from 'express';
import fetchArticle from '../services/fetchArticle.js';

const router = express.Router();

// URL -> Text 
router.post("/", async (req, res)=> {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({success: false, error : "URL is required"});
        }
       
        const article = await fetchArticle(url);
        res.json({success: true, data: article});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});
export default router;