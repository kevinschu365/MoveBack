import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "@/src/theme";

type ScreenContainerProps = PropsWithChildren<{
  withPadding?: boolean;
}>;

export function ScreenContainer({
  children,
  withPadding = true,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          withPadding && styles.contentWithPadding,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  contentWithPadding: {
    paddingHorizontal: spacing.lg,
  },
  inner: {
    gap: spacing.lg,
  },
});
