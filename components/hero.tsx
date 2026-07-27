"use client"
import React, { useState } from 'react'
import { FaFileWord } from 'react-icons/fa'
import { useQuizStore } from "../app/store/useQuizStore";

function Hero() {
    const { setQuestions } = useQuizStore();
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState<number>(10)
    const [error, setError] = useState("");

    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file)
        }

        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });
        if (!res.ok) {
            const err = await res.json();
            alert(err.error);
            return;
        }

        const data = await res.json()
        setText(data.text);
    }

    const handleCreate = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    number: selectedNumber,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data);
                setError(
                    "Suallar hazırlanarkən xəta baş verdi. Zəhmət olmasa bir neçə dəqiqə sonra yenidən cəhd edin."
                );
                return;
            }

            let quizText = data.quiz;
            quizText = quizText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const questions = JSON.parse(quizText);

            setQuestions(questions);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-16">
            <div className="exam-sheet relative w-full max-w-xl bg-[#FBF7EC] border border-[#22201B]/15 shadow-[6px_6px_0_0_rgba(34,32,27,0.12)] p-8 md:p-10">
                <div className="flex items-center justify-between mb-8 border-b border-dashed border-[#22201B]/30 pb-4">
                    <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#726B5E]">
                        Test Generator
                    </p>
                    <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#726B5E]">
                        Form A
                    </p>
                </div>

                <h1 className="font-[--font-display] text-2xl md:text-3xl text-[#22201B] mb-2 leading-snug">
                    Sənədini imtahana çevir
                </h1>
                <p className="font-[--font-body] text-[#726B5E] mb-8 text-sm md:text-base">
                    Word faylını yüklə, sual sayını seç, qalanını biz edək.
                </p>

                <label
                    htmlFor="file"
                    className="group flex items-center gap-3 cursor-pointer border-2 border-dashed border-[#726B5E]/50 hover:border-[#B23A2E] transition-colors duration-300 rounded-sm px-6 py-8 bg-[#F1E4C3]/40"
                >
                    <FaFileWord className="text-[#B23A2E] text-2xl shrink-0" />
                    {pdfFile ? (
                        <p className="font-mono text-sm text-[#22201B] truncate">
                            {pdfFile.name}
                        </p>
                    ) : (
                        <div className="font-[--font-body]">
                            <p className="text-[#22201B]">Word faylı yüklə</p>
                            <p className="text-xs text-[#726B5E] mt-1">.docx faylını bura sürüklə və ya seç</p>
                        </div>
                    )}
                </label>
                <input
                    id="file"
                    className="hidden"
                    type="file"
                    accept=".docx"
                    onChange={handleChangeFile}
                />

                {text.length !== 0 && (
                    <div className="mt-10 flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center gap-3 w-full">
                            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#726B5E]">
                                Sual sayı
                            </p>
                            <div className="flex gap-4">
                                {[10, 20, 30].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setSelectedNumber(n)}
                                        className={`bubble-select ${selectedNumber === n ? "is-selected" : ""}`}
                                        aria-pressed={selectedNumber === n}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={loading || text.length === 0}
                            onClick={handleCreate}
                            className="w-full md:w-auto md:px-10 py-3 bg-[#B23A2E] hover:bg-[#963026] disabled:opacity-50 disabled:cursor-not-allowed text-[#FBF7mono text-sm tracking-[0.15em] uppercase transition-colors duration-300"
                        >
                            {loading ? "Hazırlanır..." : "Sualları hazırla"}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-6 border-l-4 border-[#B23A2E] bg-[#B23A2E]/5 px-4 py-3">
                        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#B23A2E] mb-1">
                            Xəta
                        </p>
                        <p className="font-[--font-body] text-sm text-[#22201B]">{error}</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .exam-sheet::before {
                    content: "";
                    position: absolute;
                    top: -6px;
                    left: 24px;
                    width: 28px;
                    height: 12px;
                    background: #cbbf9c;
                    transform: rotate(-3deg);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
                }
                .bubble-select {
                    width: 46px;
                    height: 46px;
                    border-radius: 9999px;
                    border: 2px solid #726b5e;
                    color: #22201b;
                    font-family: var(--font-mono);
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .bubble-select:hover {
                    border-color: #b23a2e;
                }
                .bubble-select.is-selected {
                    background: #22201b;
                    border-color: #22201b;
                    color: #fbf7ec;
                }
            `}</style>
        </div>
    )
}

export default Hero