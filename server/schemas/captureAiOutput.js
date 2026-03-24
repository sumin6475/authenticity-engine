import { z } from 'zod';

//OpenAI Structured Output
export const captureAiOutputSchema = z.object({
    tags: z.array(z.string().min(1).max(40)),
    category: z.string().min(1).max(80),
    summary: z.string().min(1).max(200),
});

export { captureAiOutputSchema as default};