import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import systemPrompt from "../../prompts/generateQuestions";

const google = createGoogleGenerativeAI({ apiKey: process.env.apiKey });

export async function POST(req) {
  try {
    const { messages } = req.json();
    const result = generateObject({
      model: google("gemini-2.0-flash-exp"),
      system: systemPrompt,
      messages: messages,
    });
    return result.object
  } catch(error) {
    return error
  }
}
