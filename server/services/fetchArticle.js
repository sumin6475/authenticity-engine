import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

async function fetchArticle(url) {
     // 1. Fetch the URL
     const response = await fetch(url);
     const html = await response.text(); 

     //2. Parse the HTML -> JSON
     const dom = new JSDOM(html, { url : url});

     const reader = new Readability(dom.window.document);
     const article = reader.parse();

     if (!article){
        return res.status(400).json({success: false, error : "Failed to parse the article"});
    }

    return {
        title: article.title,
        textContent: article.textContent,
        excerpt: article.excerpt,
        siteName: article.siteName,
    }
    
}

export default fetchArticle;