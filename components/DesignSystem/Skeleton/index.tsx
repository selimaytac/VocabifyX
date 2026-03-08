import { useEffect, useRef } from "react";
import { Animated, type DimensionValue } from "react-native";
import { useTheme } from "tamagui";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  marginBottom = 0,
}: SkeletonProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        marginBottom,
        backgroundColor: (theme.gray5?.val as string) ?? "#E5E7EB",
        opacity,
      }}
    />
  );
}
