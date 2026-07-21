"use client";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";
import { useEffect, useState } from "react";
import { useQuizStore } from "../app/store/useQuizStore";

function Questions() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { questions } = useQuizStore();
  console.log(questions);


  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleDownloadWord = async () => {
    const children: Paragraph[] = [];

    children.push(
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [
          new TextRun({
            text: "AI Quiz Generator",
            bold: true,
          }),
        ],
      })
    );
    children.push(
      new Paragraph(`Ad Soyad: `)
    );
    children.push(
      new Paragraph(`Tarix: ${new Date().toLocaleDateString()}`)
    );

    children.push(
      new Paragraph(`Sual sayı: ${questions.length}`)
    );

    children.push(new Paragraph(""));

    questions.forEach((q, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${q.question}`,
              bold: true,
            }),
          ],
        })
      );

      q.options.forEach((option: string, i: number) => {
        const letters = ["A", "B", "C", "D"];

        children.push(
          new Paragraph(`${letters[i]}) ${option}`)
        );
      });

      children.push(new Paragraph(""));
    });

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "CAVAB KARTI",
            bold: true,
          }),
        ],
      })
    );

    const letters = ["A", "B", "C", "D"];

    questions.forEach((q, index) => {
      children.push(
        new Paragraph(
          `${index + 1}. ${letters[q.correctAnswer]}`
        )
      );
    });

    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, "AI-Quiz.docx");
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl md:text-2xl font-semibold">
          Hələ heç bir sual yaradılmayıb.
        </h2>
      </div>
    );
  }

  if (questions[0]?.isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-red-500">
          {questions[0].message}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {

        questions.length == 0 ? (
          <div></div>
        ) : (
          <div>
            <div className="flex justify-between pb-5 items-center">
              <h1 className="text-3xl font-bold">
                Hazırlanmış Suallar
              </h1>

              <button
                onClick={handleDownloadWord}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                📥 Word olaraq yüklə
              </button>
            </div>
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={index} className="border rounded-xl p-5">
                  <h2 className="font-semibold mb-4">
                    {index + 1}. {q.question}
                  </h2>

                  <div className="space-y-2">
                    {q.options.map((option: string, i: number) => {
                      const selected = answers[index] === i;
                      const correct = i === q.correctAnswer;

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(index, i)}
                          className={`w-full text-left p-3 rounded-lg border transition
                      ${selected
                              ? correct
                                ? "bg-green-100 border-green-500"
                                : "bg-red-100 border-red-500"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {answers[index] !== undefined && (
                    <p className="mt-3 font-medium">
                      {answers[index] === q.correctAnswer ? (
                        <span className="text-green-600">
                          ✅ Doğru cavab
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ❌ Yanlış. Doğru cavab: {q.options[q.correctAnswer]}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

    </div>
  );
}

export default Questions;