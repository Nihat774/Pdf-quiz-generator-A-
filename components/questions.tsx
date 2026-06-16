"use client";

import { useEffect, useState } from "react";

function Questions() {
  const [questions, setQuestions] = useState<any[]>([]);
  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);
console.log(questions);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Hazırlanmış Suallar
      </h1>

      <div className="flex flex-col gap-3">
        {Array.isArray(questions) && questions.map((q, index) => (
        <div key={index}>
          <h2 className="font-semibold">{q.question}</h2>

          {q.options.map((option: string, i: number) => (
            <p key={i}>{option}</p>
          ))}
        </div>
      ))}
      </div>
    </div>
  );
}

export default Questions;