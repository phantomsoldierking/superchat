import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { thought, tone } = body

    if (!thought || !tone) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          refinedThought: "Please provide both thought and tone.",
          originalThought: thought || "",
          tone: tone || "",
        },
        { status: 400 },
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API key not configured",
          refinedThought: "AI service is currently unavailable. Please try again later.",
          originalThought: thought,
          tone,
        },
        { status: 500 },
      )
    }

    // Use the correct model name for the current API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const tonePrompts = {
      poetic: `Transform this raw thought into a beautiful, poetic expression with metaphorical language and artistic flair. Make it sound like poetry while keeping the core meaning. Return only the refined thought, no quotes, no explanations: ${thought}`,
      honest: `Rewrite this thought in a completely honest, raw, and authentic way. Remove any pretense and make it sound genuine and real. Return only the refined thought, no quotes, no explanations: ${thought}`,
      bold: `Transform this thought into a strong, confident, and fearless statement. Make it powerful and assertive. Return only the refined thought, no quotes, no explanations: ${thought}`,
      calm: `Express this thought in a peaceful, gentle, and reflective manner. Make it sound serene and mindful. Return only the refined thought, detailed explanations: ${thought}`,
      explain: `${thought}`,
      sad: `Convey this thought with emotional depth and melancholic beauty. Add a touch of sadness while keeping it meaningful. Return only the refined thought, no quotes, no explanations: ${thought}`,
    }

    const prompt =
      tonePrompts[tone as keyof typeof tonePrompts] ||
      `Refine and improve this thought while keeping its essence. Return only the refined thought, no quotes, no explanations: ${thought}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let refinedThought = response.text()

    // Clean up the response
    refinedThought = refinedThought
      .replace(/^["']|["']$/g, "") // Remove quotes at start/end
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .trim()

    // Ensure we have a valid response
    if (!refinedThought || refinedThought.length < 5) {
      refinedThought = "I couldn't refine that thought right now. Please try rephrasing it."
    }

    return NextResponse.json({
      refinedThought,
      originalThought: thought,
      tone,
      success: true,
    })
  } catch (error: any) {
    console.error("Error generating thought:", error)

    // Extract the original request data for fallback response
    let thought = ""
    let tone = ""

    try {
      const body = await request.json()
      thought = body.thought || ""
      tone = body.tone || ""
    } catch {
      // If we can't parse the request, use defaults
    }

    // Provide specific error messages based on error type
    let errorMessage = "I'm having trouble processing your thought right now. Please try again."

    if (error.message?.includes("API_KEY")) {
      errorMessage = "AI service configuration issue. Please contact support."
    } else if (error.message?.includes("quota") || error.message?.includes("limit")) {
      errorMessage = "AI service is temporarily busy. Please try again in a moment."
    } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
      errorMessage = "Connection issue. Please check your internet and try again."
    }

    return NextResponse.json(
      {
        error: "Failed to generate thought",
        refinedThought: errorMessage,
        originalThought: thought,
        tone,
        success: false,
      },
      { status: 500 },
    )
  }
}
