import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const languageNames: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese (Simplified)",
  hi: "Hindi",
  ar: "Arabic",
  ur: "Urdu",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, targetLanguage } = body

    if (!text || !targetLanguage) {
      return NextResponse.json({
        error: "Missing required fields",
        translatedText: "Please provide text and target language.",
        originalText: text || "",
        targetLanguage: targetLanguage || "",
        success: false,
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: "Translation service unavailable",
        translatedText: "Translation service is currently unavailable.",
        originalText: text,
        targetLanguage,
        success: false,
      })
    }

    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const languageName = languageNames[targetLanguage] || targetLanguage

    const prompt = `Translate this text to ${languageName}. Maintain the emotional tone and style. Return only the translation, no quotes or explanations: ${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let translatedText = response.text().trim()

    // Clean up the translation
    translatedText = translatedText
      .replace(/^["']|["']$/g, "") // Remove quotes
      .replace(/^Translation:\s*/i, "") // Remove "Translation:" prefix
      .trim()

    if (!translatedText || translatedText.length < 2) {
      translatedText = "Translation unavailable for this text."
    }

    return NextResponse.json({
      translatedText,
      originalText: text,
      targetLanguage,
      success: true,
    })
  } catch (error: any) {
    console.error("Error translating text:", error)

    let text = ""
    let targetLanguage = ""

    try {
      const body = await request.json()
      text = body.text || ""
      targetLanguage = body.targetLanguage || ""
    } catch {
      // Fallback if we can't parse request
    }

    let errorMessage = "Translation is temporarily unavailable."

    if (error.message?.includes("API_KEY")) {
      errorMessage = "Translation service configuration issue."
    } else if (error.message?.includes("quota")) {
      errorMessage = "Translation service is busy. Please try again."
    }

    return NextResponse.json({
      error: "Translation failed",
      translatedText: errorMessage,
      originalText: text,
      targetLanguage,
      success: false,
    })
  }
}
