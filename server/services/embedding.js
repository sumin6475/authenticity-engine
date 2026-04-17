import OpenAI from "openai";
const openai = new OpenAI();

/** Embedding vector for `text` (text-embedding-3-small), truncated to API limits. */
export async function generateEmbedding(text) {
    const truncated = text.slice(0,8000);
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: truncated,
    });
    return response.data[0].embedding;
}