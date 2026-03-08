import { ScrollView } from "react-native";
import { XStack } from "tamagui";

import { Label } from "@/components/DesignSystem/Typography";

interface CategoryChipProps<T extends string> {
  categories: { key: T; label: string }[];
  selected: T;
  onSelect: (key: T) => void;
}

export function CategoryChips<T extends string>({
  categories,
  selected,
  onSelect,
}: CategoryChipProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <XStack gap="$2" paddingVertical="$1">
        {categories.map((category) => {
          const isSelected = selected === category.key;
          return (
            <XStack
              key={category.key}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius={100}
              backgroundColor={isSelected ? "#F5A623" : "#2a2a2a"}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => onSelect(category.key)}
            >
              <Label color={isSelected ? "#1a1a1a" : "$gray10"} fontWeight={isSelected ? "700" : "500"}>
                {category.label}
              </Label>
            </XStack>
          );
        })}
      </XStack>
    </ScrollView>
  );
}
