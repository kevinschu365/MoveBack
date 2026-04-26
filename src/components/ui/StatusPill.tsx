import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/src/theme";
import type { TrainingStatus } from "@/src/types";

type StatusPillProps = {
  status: TrainingStatus;
};

const statusMap: Record<
  TrainingStatus,
  { label: string; backgroundColor: string; textColor: string }
> = {
  open: {
    label: "Offen",
    backgroundColor: "#E5EEF8",
    textColor: colors.primary,
  },
  done: {
    label: "Erledigt",
    backgroundColor: "#DDF8EA",
    textColor: colors.success,
  },
  pause: {
    label: "Pause",
    backgroundColor: "#FDECC8",
    textColor: "#A16207",
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const token = statusMap[status];

  return (
    <View style={[styles.pill, { backgroundColor: token.backgroundColor }]}>
      <Text style={[styles.label, { color: token.textColor }]}>{token.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});
