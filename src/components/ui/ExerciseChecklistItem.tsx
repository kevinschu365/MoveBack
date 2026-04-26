import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { colors, radius, spacing } from "@/src/theme";
import type { Exercise } from "@/src/types";

type ExerciseChecklistItemProps = {
  exercise: Exercise;
  completed: boolean;
  onToggle: () => void;
};

export function ExerciseChecklistItem({
  exercise,
  completed,
  onToggle,
}: ExerciseChecklistItemProps) {
  return (
    <Card style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.prescription}>{exercise.prescription}</Text>
        </View>
        <Pressable
          onPress={onToggle}
          style={[styles.checkbox, completed && styles.checkboxCompleted]}
        >
          <Text style={[styles.checkboxLabel, completed && styles.checkboxLabelCompleted]}>
            {completed ? "OK" : ""}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.description}>{exercise.description}</Text>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.footerButton,
          completed && styles.footerButtonCompleted,
          pressed && styles.footerButtonPressed,
        ]}
      >
        <Text
          style={[
            styles.footerButtonLabel,
            completed && styles.footerButtonLabelCompleted,
          ]}
        >
          {completed ? "Als offen markieren" : "Erledigt"}
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  cardCompleted: {
    borderColor: "#BDEFD2",
    backgroundColor: "#F7FEFA",
  },
  header: {
    flexDirection: "row",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  prescription: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  checkboxLabel: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "800",
  },
  checkboxLabelCompleted: {
    color: colors.surface,
  },
  footerButton: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  footerButtonCompleted: {
    backgroundColor: "#DDF8EA",
  },
  footerButtonPressed: {
    opacity: 0.88,
  },
  footerButtonLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  footerButtonLabelCompleted: {
    color: colors.success,
  },
});
