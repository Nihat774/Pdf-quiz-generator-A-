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
      console.log(data); // Backend xətasını göstər
      console.log(data.error);
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
        <div className='h-[80vh] flex flex-col justify-center'>
            <div>
                <label
                    className='flex justify-center hover:border hover:border-blue-500 duration-300 items-center gap-2 cursor-pointer h-[15vh] w-[30vw] p-5 bg-neutral-100 rounded-lg'
                    htmlFor="file">
                    {
                        pdfFile ? <div className='flex items-center gap-2'>
                            <FaFileWord className='text-blue-500 text-xl' />
                            <p>{pdfFile.name}</p>
                        </div> : (
                            <div className='flex items-center text-xl gap-2 '>
                                <FaFileWord className='text-blue-500 text-xl' />
                                <p>Word və ya PDF yüklə</p>
                            </div>
                        )
                    }
                </label>
                <input
                    id='file'
                    className='hidden'
                    type="file"
                    accept='.docx,.pdf'
                    onChange={handleChangeFile}
                />
            </div>
            {
                text.length != 0 && (
                    <div className='flex flex-col gap-4 items-center justify-center mt-9'>
                        <div className='flex flex-col items-center gap-3'>
                            <p className='text-xl'>Sual sayı seç</p>
                            <div className='flex gap-4'>
                                <p onClick={() => setSelectedNumber(10)} className={`rounded-[10px] cursor-pointer px-2 py-1 duration-300 text-2xl ${selectedNumber == 10 ? "bg-blue-500 text-white" : "bg-neutral-300"}`}>10</p>
                                <p onClick={() => setSelectedNumber(20)} className={`rounded-[10px] cursor-pointer duration-300 px-2 py-1 text-2xl ${selectedNumber == 20 ? "bg-blue-500 text-white" : "bg-neutral-300"}`}>20</p>
                                <p onClick={() => setSelectedNumber(30)} className={`rounded-[10px] cursor-pointer duration-300 text-2xl px-2 py-1 ${selectedNumber == 30 ? "bg-blue-500 text-white" : "bg-neutral-300"}`}>30</p>
                            </div>
                        </div>
                        <button disabled={loading || text.length == 0}
                            onClick={handleCreate}
                            className={`bg-sky-500 hover:bg-sky-400  w-[15vw] duration-300 px-5 cursor-pointer rounded-lg py-3 text-white`}>
                            {loading ?
                                (
                                    <div>
                                        yüklənir...
                                    </div>
                                ) :
                                (
                                    <p>Sualları hazırla</p>
                                )
                            }
                        </button>
                    </div>
                )
            }

        </div>
    )
}

export default Hero