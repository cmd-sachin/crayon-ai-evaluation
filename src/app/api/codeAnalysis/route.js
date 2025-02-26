import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import systemPrompt from "@/app/prompts/codeAnalysis";

const google = createGoogleGenerativeAI({ apiKey: process.env.API_KEY });

export async function POST(req) {
  try {
    const { taskAssigned, taskSubmitted } = await req.json();

    const result = await generateObject({
      model: google("gemini-2.0-flash-thinking-exp-01-21"),
      prompt: JSON.stringify({
        taskAssigned,
        taskSubmitted,
      }),
      schema: z.object({
        isVerified: z.boolean(),
        summary: z.string(),
        techStack: z.array(z.string()),
        externalApi: z.array(z.string()),
        completionStatus: z.number(),
        productionReadiness: z.string(),
        feedback: z.string(),
        rating: z.number(),
      }),
      temperature: 0.2,
      system: systemPrompt,
    });

    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
