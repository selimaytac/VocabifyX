import { useUserStore } from "@/store/userStore";

describe("userStore – resumable onboarding", () => {
  beforeEach(() => {
    useUserStore.getState().reset();
  });

  it("should start with onboardingStep null", () => {
    expect(useUserStore.getState().onboardingStep).toBeNull();
  });

  it("should persist onboardingStep when setOnboardingStep is called", () => {
    useUserStore.getState().setOnboardingStep("language");
    expect(useUserStore.getState().onboardingStep).toBe("language");
  });

  it("should update onboardingStep through all steps", () => {
    const steps = ["welcome", "language", "firstList", "allSet"] as const;
    for (const step of steps) {
      useUserStore.getState().setOnboardingStep(step);
      expect(useUserStore.getState().onboardingStep).toBe(step);
    }
  });

  it("should clear onboardingStep when set to null", () => {
    useUserStore.getState().setOnboardingStep("firstList");
    useUserStore.getState().setOnboardingStep(null);
    expect(useUserStore.getState().onboardingStep).toBeNull();
  });

  it("should reset onboardingStep on reset()", () => {
    useUserStore.getState().setOnboardingStep("allSet");
    useUserStore.getState().reset();
    expect(useUserStore.getState().onboardingStep).toBeNull();
  });

  it("should reset hasCompletedOnboarding on reset()", () => {
    useUserStore.getState().setHasCompletedOnboarding(true);
    useUserStore.getState().reset();
    expect(useUserStore.getState().hasCompletedOnboarding).toBe(false);
  });
});
