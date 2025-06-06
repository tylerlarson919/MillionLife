import { geminiModel } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, gem_type } = await req.json();

  if (!prompt || !gem_type) {
    return NextResponse.json(
      { error: "Prompt and gem_type are required" },
      { status: 400 }
    );
  }

  try {
    let fullPrompt = "";
    if (gem_type === "goal_decomposition") {
      fullPrompt = `Decompose the following goal into a list of actionable tasks: "${prompt}"`;
    } else if (gem_type === "dynamic_routine") {
      fullPrompt = `Based on the following information, create a daily routine: "${prompt}"`;
    } else if (gem_type === "weekly_review") {
      fullPrompt = `Summarize the following completed tasks and appointments for a weekly review: "${prompt}"`;
    } else {
      return NextResponse.json({ error: "Invalid gem_type" }, { status: 400 });
    }

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Gemini" }, { status: 500 });
  }
}