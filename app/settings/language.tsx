import { Check } from "@tamagui/lucide-icons";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import { Label } from "@/components/DesignSystem/Typography";
import { useLanguageStore } from "@/store/languageStore";

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "tr" as const, label: "Türkçe" },
];

export default function LanguageScreen() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  return (
    <ScrollView>
      <YStack padding="$4" gap="$3">
        {LANGUAGES.map((lang) => (
          <Card
            key={lang.code}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setLocale(lang.code)}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Label>{lang.label}</Label>
              {locale === lang.code && <Check size={20} color="#FFB400" />}
            </XStack>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );
}
