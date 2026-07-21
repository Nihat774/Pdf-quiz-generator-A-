import { create } from "zustand";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  isError:boolean;
  message:string
}

interface QuizStore {
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
  clearQuestions: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  questions: [],
  setQuestions: (questions) => set({ questions }),
  clearQuestions: () => set({ questions: [] }),
}));