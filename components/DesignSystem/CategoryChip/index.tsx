import { ScrollView } from "react-native";
import { XStack } from "tamagui";

import { Label } from "@/components/DesignSystem/Typography";

interface CategoryChipProps<T extends string> {
  categories: { key: T; label: string }[];
  selected: T;
  onSelect: (key: T) => void;
  variant?: "scroll" | "segmented";
}

export function CategoryChips<T extends string>({
  categories,
  selected,
  onSelect,
  variant = "scroll",
}: CategoryChipProps<T>) {
  if (variant === "segmented") {
    return (
      <XStack
        backgroundColor="#F7F8FB"
        borderRadius={10}
        padding="$1"
        gap="$0"
      >
        {categories.map((category) => {
          const isSelected = selected === category.key;
          return (
            <XStack
              key={category.key}
              flex={1}
              paddingVertical="$2"
              borderRadius={8}
              backgroundColor={isSelected ? "#213448" : "transparent"}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => onSelect(category.key)}
              justifyContent="center"
              alignItems="center"
            >
              <Label
                color={isSelected ? "#FFFFFF" : "#777777"}
                fontWeight={isSelected ? "600" : "500"}
                textAlign="center"
              >
                {category.label}
              </Label>
            </XStack>
          );
        })}
      </XStack>
    );
  }

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
              backgroundColor={isSelected ? "#213448" : "#F7F8FB"}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => onSelect(category.key)}
            >
              <Label
                color={isSelected ? "#FFFFFF" : "#777777"}
                fontWeight={isSelected ? "600" : "500"}
              >
                {category.label}
              </Label>
            </XStack>
          );
        })}
      </XStack>
    </ScrollView>
  );
}
