import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, number } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Sən test hazırlayan köməkçisən.

Aşağıdakı mətni oxu və ${number} çoxseçimli test sualı yarat.
Əgər mətn boşdursa, çox qısadırsa və ya test hazırlamaq üçün kifayət qədər məlumat yoxdursa, sual yaratma.

Bu halda yalnız aşağıdakı JSON-u qaytar:

    [
{
        question: "Sənəddə test hazırlamaq üçün kifayət qədər mətn yoxdur.",
        options: [],
        correctAnswer: -1,
        isError: true,
      },
  ]

Qaydalar:

1. Yalnız JSON qaytar.
2. Heç bir izah yazma.
3. \`\`\`json və ya \`\`\` istifadə etmə.
4. Hər sualın 4 variantı olsun.
5. Variantların əvvəlində A), B), C), D) yazma.
6. correctAnswer düzgün variantın indeksini göstərsin.
7. İndeks 0, 1, 2 və ya 3 olsun.

Nəticə yalnız bu formatda olmalıdır:

[
  {
    "question": "Sual",
    "options": [
      "Variant 1",
      "Variant 2",
      "Variant 3",
      "Variant 4"
    ],
    "correctAnswer": 1
  }
]

Mətn:

${text}
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