import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing } from "@/src/theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
