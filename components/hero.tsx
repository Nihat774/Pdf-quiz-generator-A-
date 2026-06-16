"use client"
import React, { useState } from 'react'
import { FaFileWord } from 'react-icons/fa'

function Hero() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
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

        const text = await res.text()
        setText(text);
    }

    const handleCreate = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text
                })
            })

            const data = await res.json();

            let quizText = data.quiz;
            quizText = quizText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const questions = JSON.parse(quizText);

            localStorage.setItem(
                "questions",
                JSON.stringify(questions)
            );

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }

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
                                <p>Word Faylı yüklə</p>
                            </div>
                        )
                    }
                </label>
                <input
                    id='file'
                    className='hidden'
                    type="file"
                    accept='.docx'
                    onChange={handleChangeFile}
                />
            </div>
            {
                text.length != 0 && (
                    <div className='flex  justify-center mt-9'>
                        <button disabled={loading || text.length == 0}
                            onClick={handleCreate}
                            className={`bg-sky-500 hover:bg-sky-400  w-[15vw] duration-300 px-5 cursor-pointer rounded-lg py-3 text-white`}>
                            {loading ? 
                            (
                                <div>
                                    yüklənir...
                                </div>
                            ):
                            (
                                <p>Suallar hazırla</p>
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