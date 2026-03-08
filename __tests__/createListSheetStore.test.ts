import { useCreateListSheetStore } from "../store/createListSheetStore";

describe("createListSheetStore", () => {
  beforeEach(() => {
    useCreateListSheetStore.setState({ isOpen: false });
  });

  it("initialises with isOpen false", () => {
    const state = useCreateListSheetStore.getState();
    expect(state.isOpen).toBe(false);
  });

  it("open() sets isOpen to true", () => {
    useCreateListSheetStore.getState().open();
    expect(useCreateListSheetStore.getState().isOpen).toBe(true);
  });

  it("close() sets isOpen to false", () => {
    useCreateListSheetStore.getState().open();
    expect(useCreateListSheetStore.getState().isOpen).toBe(true);

    useCreateListSheetStore.getState().close();
    expect(useCreateListSheetStore.getState().isOpen).toBe(false);
  });

  it("toggling open/close works repeatedly", () => {
    const store = useCreateListSheetStore;

    store.getState().open();
    expect(store.getState().isOpen).toBe(true);

    store.getState().close();
    expect(store.getState().isOpen).toBe(false);

    store.getState().open();
    expect(store.getState().isOpen).toBe(true);
  });
});
