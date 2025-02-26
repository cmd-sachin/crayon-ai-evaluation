// store.js
import { create } from "zustand";

export const useFileStore = create((set) => ({
  zipFiles: [],
  fileData: [],
  videoFile: null,
  setZipFiles: (files) => set({ zipFiles: files }),
  setFileData: (data) => set({ fileData: data }),
  appendFileData: (data) =>
    set((state) => ({ fileData: [...state.fileData, data] })),
  setVideoFile: (file) => set({ videoFile: file }),
}));
