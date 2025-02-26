import { create } from "zustand";

const DEFAULT_TIMER_SECONDS = 10;

export const useQuizStore = create((set) => ({
  quizData: {},
  currentQuestionIndex: 0,
  timer: DEFAULT_TIMER_SECONDS,
  // Adds quiz data keyed by question number
  addQuizData: (key, data) =>
    set((state) => ({
      quizData: { ...state.quizData, [key]: data },
    })),
  // Sets the current question index
  setCurrentQuestionIndex: (index) =>
    set(() => ({ currentQuestionIndex: index })),
  // Sets the timer value
  setTimer: (newTimer) => set(() => ({ timer: newTimer })),
  // Clears the store and refreshes the page
  clearStore: () => {
    localStorage.clear();
    set({
      quizData: {},
      currentQuestionIndex: 0,
      timer: DEFAULT_TIMER_SECONDS,
    });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  },
}));
