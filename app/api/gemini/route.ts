import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Explicitly create a Google provider instance with the API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check for API key existence and throw a clear error
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "Missing GEMINI_API_KEY. Please set it in your .env.local file and restart your server."
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      // Use Response to send a clear error message to the client
      return new Response("Prompt is required", { status: 400 });
    }

    const result = await streamText({
      model: google("models/gemini-1.5-flash"),
      prompt: prompt,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    // Send a plain text error response for the client to display
    return new Response(error.message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
} 