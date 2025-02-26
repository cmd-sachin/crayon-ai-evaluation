import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import systemPrompt from "../../prompts/generateQuestions";
import z from "zod";

const google = createGoogleGenerativeAI({ apiKey: process.env.API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();
    console.log(messages);
    const result = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      system: systemPrompt,
      schema: z.object({
        question: z.string(),
        options: z.array(z.string()).optional(),
      }),
      messages: messages,
    });
    console.log(result.object);
    return new Response(JSON.stringify(result.object));
  } catch (error) {
    console.error("Error in generateQuestion API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
