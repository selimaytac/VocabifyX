export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
  revenueCat: {
    iosApiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? "",
    androidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? "",
  },
  amplitude: {
    apiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY ?? "",
  },
  adjust: {
    appToken: process.env.EXPO_PUBLIC_ADJUST_APP_TOKEN ?? "",
  },
  sentry: {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? "",
  },
  superwall: {
    iosApiKey: process.env.EXPO_PUBLIC_SUPERWALL_IOS_API_KEY ?? "",
    androidApiKey: process.env.EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY ?? "",
  },
  isDev: __DEV__,
} as const;
