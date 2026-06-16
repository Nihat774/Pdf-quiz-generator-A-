import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Bu mətni oxu və 10 test sualı yarat.

Mətn:
${text}

JSON formatında qaytar:
[
  {
    "question": "...",
    "options": ["A","B","C","D"],
    "correctAnswer": "..."
  }
]
      `,
    });

    return Response.json({
      quiz: response.text,
    });
  } catch (err: any) {
    console.error(err);

    return Response.json(
      { error: "AI error", details: err?.message },
      { status: 500 }
    );
  }
}