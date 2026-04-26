import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/ui/Card";
import { MobilityRatingRow } from "@/src/components/ui/MobilityRatingRow";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { mobilityAreas } from "@/src/data/mockData";
import { useAppStore } from "@/src/store/useAppStore";
import { colors, spacing } from "@/src/theme";
import { getMobilityScore } from "@/src/utils/metrics";

export default function MobilityCheckScreen() {
  const mobilityRatings = useAppStore((state) => state.mobilityRatings);
  const setMobilityRating = useAppStore((state) => state.setMobilityRating);

  const mobilityScore = getMobilityScore(mobilityRatings);

  return (
    <ScreenContainer>
      <SectionHeader
        title="Mobility Check"
        subtitle="Bewerte Schulter, Huefte, Ruecken, Beine und Nacken auf einer Skala von 1 bis 5."
      />

      <Card style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Mobility Score</Text>
        <Text style={styles.scoreValue}>{mobilityScore}</Text>
        <Text style={styles.scoreHint}>
          Der Score wird aus dem Durchschnitt deiner 5 Bewertungen berechnet.
        </Text>
      </Card>

      {mobilityAreas.map((area) => (
        <MobilityRatingRow
          key={area.key}
          area={area}
          value={mobilityRatings[area.key]}
          onChange={setMobilityRating}
        />
      ))}

      <View style={styles.scaleHint}>
        <Text style={styles.scaleHintText}>
          1 = sehr eingeschraenkt, 5 = frei und belastbar
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    alignItems: "center",
    gap: spacing.sm,
  },
  scoreLabel: {
    color: "#B7C9DB",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  scoreValue: {
    color: colors.accent,
    fontSize: 54,
    fontWeight: "800",
  },
  scoreHint: {
    color: "#D8E4F0",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  scaleHint: {
    paddingHorizontal: spacing.sm,
  },
  scaleHintText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
});
