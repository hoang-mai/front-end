import { create } from "zustand";

interface ImageState {
    image: string | null;
    setImage: (image: string | null) => void;
}

export const useImage = create<ImageState>((set) => ({
    image: null,
    setImage: (image) => set({ image }),
}));