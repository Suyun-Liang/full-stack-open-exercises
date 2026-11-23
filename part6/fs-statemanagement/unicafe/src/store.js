import { create } from "zustand";
import { useShallow } from "zustand/shallow";

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}));

export const useFeedback = () =>
  useFeedbackStore(
    useShallow((state) => ({
      good: state.good,
      neutral: state.neutral,
      bad: state.bad,
    })),
  );
export const useFeedbackControls = () =>
  useFeedbackStore((state) => state.actions);
