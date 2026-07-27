"use client";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";
import { useState } from "react";
import { useQuizStore } from "../app/store/useQuizStore";

const LETTERS = ["A", "B", "C", "D"];

function Questions() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { questions } = useQuizStore();

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
    children.push(new Paragraph(`Ad Soyad: `));
    children.push(new Paragraph(`Tarix: ${new Date().toLocaleDateString()}`));
    children.push(new Paragraph(`Sual sayı: ${questions.length}`));
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
        children.push(new Paragraph(`${LETTERS[i]}) ${option}`));
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

    questions.forEach((q, index) => {
      children.push(new Paragraph(`${index + 1}. ${LETTERS[q.correctAnswer]}`));
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
      <div className="text-center py-16">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#726B5E] mb-3">
          Status
        </p>
        <h2 className="font-[--font-display] text-xl md:text-2xl text-[#22201B]">
          Hələ heç bir sual yaradılmayıb.
        </h2>
      </div>
    );
  }

  if (questions[0]?.isError) {
    return (
      <div className="text-center py-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#B23A2E]">
          {questions[0].message}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-12">
      <div className="flex justify-between items-center pb-6 mb-8 border-b-2 border-dashed border-[#22201B]/25">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#726B5E]">
            Form B
          </p>
          <h1 className="font-[--font-display] text-xl md:text-3xl text-[#22201B]">
            Hazırlanmış Suallar
          </h1>
        </div>

        <button
          onClick={handleDownloadWord}
          className="px-5 py-3 bg-[#22201B] hover:bg-[#3a352c] text-[#FBF7EC] font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-300 shrink-0"
        >
          Word olaraq yüklə
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-[#FBF7EC] border border-[#22201B]/15 shadow-[4px_4px_0_0_rgba(34,32,27,0.1)] p-6"
          >
            <h2 className="font-[--font-body] font-semibold text-[#22201B] mb-5 flex gap-3">
              <span className="font-mono text-[#B23A2E] shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{q.question}</span>
            </h2>

            <div className="space-y-3">
              {q.options.map((option: string, i: number) => {
                const selected = answers[index] === i;
                const correct = i === q.correctAnswer;
                const answered = answers[index] !== undefined;

                let rowClass = "border-[#726B5E]/40";
                if (answered && selected && correct) rowClass = "border-[#3F6B4C] bg-[#3F6B4C]/5";
                else if (answered && selected && !correct) rowClass = "border-[#B23A2E] bg-[#B23A2E]/5";
                else if (answered && correct) rowClass = "border-[#3F6B4C]/60";

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(index, i)}
                    className={`w-full flex items-center gap-4 text-left p-3 border rounded-sm transition-colors duration-200 ${rowClass} hover:border-[#22201B]`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs
                        ${selected ? "bg-[#22201B] border-[#22201B] text-[#FBF7EC]" : "border-[#726B5E] text-[#22201B]"}`}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="font-[--font-body] text-[#22201B]">{option}</span>
                  </button>
                );
              })}
            </div>

            {answers[index] !== undefined && (
              <p className="mt-4 font-mono font-semibold text-xs tracking-widest uppercase">
                {answers[index] === q.correctAnswer ? (
                  <span className="text-[#3F6B4C]">✓ Doğru cavab</span>
                ) : (
                  <span className="text-[#B23A2E]">
                    ✕ Yanlış — Doğru cavab: {q.options[q.correctAnswer]}
                  </span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;