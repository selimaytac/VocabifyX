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
    const steps = ["welcome", "name", "purpose", "topic", "loading"] as const;
    for (const step of steps) {
      useUserStore.getState().setOnboardingStep(step);
      expect(useUserStore.getState().onboardingStep).toBe(step);
    }
  });

  it("should clear onboardingStep when set to null", () => {
    useUserStore.getState().setOnboardingStep("topic");
    useUserStore.getState().setOnboardingStep(null);
    expect(useUserStore.getState().onboardingStep).toBeNull();
  });

  it("should reset onboardingStep on reset()", () => {
    useUserStore.getState().setOnboardingStep("loading");
    useUserStore.getState().reset();
    expect(useUserStore.getState().onboardingStep).toBeNull();
  });

  it("should reset hasCompletedOnboarding on reset()", () => {
    useUserStore.getState().setHasCompletedOnboarding(true);
    useUserStore.getState().reset();
    expect(useUserStore.getState().hasCompletedOnboarding).toBe(false);
  });

  it("should start with null onboarding personalization fields", () => {
    expect(useUserStore.getState().onboardingTopic).toBeNull();
    expect(useUserStore.getState().onboardingCategory).toBeNull();
    expect(useUserStore.getState().onboardingWordCount).toBe(15);
  });

  it("should persist onboarding personalization data", () => {
    useUserStore.getState().setOnboardingPersonalization({
      topic: "Legal English",
      category: "academic",
      wordCount: 30,
    });
    expect(useUserStore.getState().onboardingTopic).toBe("Legal English");
    expect(useUserStore.getState().onboardingCategory).toBe("academic");
    expect(useUserStore.getState().onboardingWordCount).toBe(30);
  });

  it("should reset onboarding personalization on reset()", () => {
    useUserStore.getState().setOnboardingPersonalization({
      topic: "Medical Terms",
      category: "health",
      wordCount: 50,
    });
    useUserStore.getState().reset();
    expect(useUserStore.getState().onboardingTopic).toBeNull();
    expect(useUserStore.getState().onboardingCategory).toBeNull();
    expect(useUserStore.getState().onboardingWordCount).toBe(15);
  });
});
