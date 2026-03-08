import { create } from "zustand";

interface CreateListSheetState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateListSheetStore = create<CreateListSheetState>()(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
);
