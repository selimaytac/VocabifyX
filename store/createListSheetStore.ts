import { create } from "zustand";

interface CreateListSheetState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  reset: () => void;
}

const initialState = {
  isOpen: false,
};

export const useCreateListSheetStore = create<CreateListSheetState>()(
  (set) => ({
    ...initialState,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    reset: () => set(initialState),
  }),
);
