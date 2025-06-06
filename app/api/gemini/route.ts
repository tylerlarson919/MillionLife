import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { CoreMessage } from "ai";

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

    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = await streamText({
      model: google("models/gemini-1.5-flash"),
      messages,
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