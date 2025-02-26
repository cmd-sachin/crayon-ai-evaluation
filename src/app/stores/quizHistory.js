import { create } from "zustand";

export const useQuizHistory = create((set) => ({
  // Array of quiz history entries.
  // Each entry is an object: { questionNumber, question, options, response }
  quizHistory: [],
  // Add a new entry to the history
  addHistoryEntry: (entry) =>
    set((state) => ({
      quizHistory: [...state.quizHistory, entry],
    })),
  // Clear the quiz history
  clearHistory: () => set({ quizHistory: [] }),
}));
