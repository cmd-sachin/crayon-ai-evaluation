import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_STATE = {
  currentQuestionIndex: 0,
  quizData: {}, // { questionNumber: { question, options, response, ... } }
  quizHistory: [], // Array of { questionNumber, section, question, options, response }
};

const useQuizStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      addQuizData: (questionNumber, data) =>
        set((state) => ({
          quizData: { ...state.quizData, [questionNumber]: data },
        })),
      // Append a new entry to quizHistory.
      addQuizHistory: (entry) =>
        set((state) => ({
          quizHistory: [...state.quizHistory, entry],
        })),
      // Update the existing entry for a given question number or add it if not present.
      updateQuizHistory: (entry) =>
        set((state) => {
          const idx = state.quizHistory.findIndex(
            (e) => e.questionNumber === entry.questionNumber
          );
          if (idx > -1) {
            const newHistory = [...state.quizHistory];
            newHistory[idx] = entry;
            return { quizHistory: newHistory };
          }
          return { quizHistory: [...state.quizHistory, entry] };
        }),
      resetQuiz: () => set(DEFAULT_STATE),
    }),
    {
      name: "quiz-store", // Key for localStorage persistence
    }
  )
);

export default useQuizStore;
