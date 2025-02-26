import { create } from "zustand";

export const usedataStore = create((set) => ({
  description: [],
  resources: [],
  title: [],
  totaldata: [],

  // Set all data at once (each property should be an array)
  setAllData: (data) =>
    set({
      description: data.description || [],
      resources: data.resources || [],
      title: data.title || [],
      totaldata: data.totaldata || [],
    }),

  // Append a new set of data to each array; here `data` is expected to be an object
  // with keys: description, resources, and title.
  // appendAllData: (data) =>
  //   set((state) => ({
  //     description: [...state.description, data.description],
  //     resources: [...state.resources, data.resources],
  //     title: [...state.title, data.title],
  //     totaldata: [...state.totaldata, data], // Here totaldata holds the entire data object
  //   })),
}));
