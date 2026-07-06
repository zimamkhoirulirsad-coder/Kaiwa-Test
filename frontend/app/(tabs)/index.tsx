import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, radius, type, IMAGES } from "@/src/theme";
import { loadProfile, UserProfile, DEFAULT_PROFILE } from "@/src/store/user";
import { vocabDeck } from "@/src/data/vocab";
import { scenarios } from "@/src/data/scenarios";
import { ProgressRing } from "@/src/components/ProgressRing";

function greet(name: string) {
  const h = new Date().getHours();
  const time = h < 5 ? "こんばんは" : h < 12 ? "おはよう" : h < 18 ? "こんにちは" : "こんばんは";
  return { ja: time, en: h < 12 ? `Good morning, ${name}` : h < 18 ? `Good afternoon, ${name}` : `Good evening, ${name}` };
}

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const p = await loadProfile();
    setProfile(p);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, []),
  );

  const g = greet(profile.name);
  const dailyProgress =
    profile.dailyGoalMinutes > 0
      ? Math.min(profile.minutesToday / profile.dailyGoalMinutes, 1)
      : 0;
  const wordOfDay = vocabDeck[new Date().getDate() % vocabDeck.length];
  const featuredScenarios = scenarios.slice(0, 6);

  return (
    <View style={styles.root} testID="home-screen">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl tintColor={colors.primary} refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <ImageBackground
          source={{ uri: IMAGES.sakuraNight }}
          style={styles.header}
          imageStyle={{ opacity: 0.35 }}
        >
          <View style={styles.headerOverlay} />
          <SafeAreaView edges={["top"]} style={styles.headerContent}>
            <Text style={styles.jaGreet}>{g.ja}</Text>
            <Text style={type.h2}>{g.en}</Text>
            <View style={styles.headerRow}>
              <View style={styles.streakPill} testID="home-streak">
                <Ionicons name="flame" size={16} color={colors.warning} />
                <Text style={styles.streakText}>{profile.streak} day streak</Text>
              </View>
              <View style={[styles.streakPill, { backgroundColor: "#1B1420" }]}>
                <Ionicons name="star" size={14} color={colors.primary} />
                <Text style={styles.streakText}>{profile.xp} XP</Text>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Daily goal ring */}
        <View style={styles.section}>
          <View style={styles.goalCard} testID="home-goal-card">
            <ProgressRing
              progress={dailyProgress}
              size={132}
              strokeWidth={12}
              label={`${Math.round(dailyProgress * 100)}%`}
              sublabel={`${profile.minutesToday}/${profile.dailyGoalMinutes} min`}
            />
            <View style={{ flex: 1, marginLeft: 24 }}>
              <Text style={styles.levelBadgeSmall}>{profile.jlptLevel} LEVEL</Text>
              <Text style={[type.h3, { marginTop: 6 }]}>Daily Goal</Text>
              <Text style={[type.small, { marginTop: 6 }]}>
                {dailyProgress >= 1
                  ? "🎉 Goal reached — keep the flame alive!"
                  : "Chat with your tutor or practice speaking to close the ring."}
              </Text>
            </View>
          </View>
        </View>

        {/* Continue learning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue learning</Text>
          <TouchableOpacity
            testID="home-continue-chat"
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/chat")}
            style={styles.continueCard}
          >
            <View style={styles.continueIcon}>
              <Ionicons name="chatbubbles" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={type.h4}>Chat with your AI tutor</Text>
              <Text style={[type.small, { marginTop: 2 }]}>
                Natural conversation · romaji · translation
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="home-continue-speaking"
            activeOpacity={0.85}
            onPress={() => router.push("/speaking")}
            style={[styles.continueCard, { marginTop: 12 }]}
          >
            <View style={[styles.continueIcon, { backgroundColor: "#1B1B25", borderColor: colors.secondary }]}>
              <Ionicons name="mic" size={24} color={colors.secondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={type.h4}>Speaking practice</Text>
              <Text style={[type.small, { marginTop: 2 }]}>Press-to-talk · pronunciation score</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Scenarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Scenarios</Text>
            <TouchableOpacity
              testID="home-scenarios-see-all"
              onPress={() => router.push("/scenarios")}
            >
              <Text style={[type.small, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.screen, gap: 12 }}
          >
            {featuredScenarios.map((s) => (
              <TouchableOpacity
                key={s.id}
                testID={`home-scenario-${s.id}`}
                activeOpacity={0.85}
                onPress={() => router.push(`/scenarios/${s.id}`)}
                style={styles.scenarioTile}
              >
                <View style={[styles.scenarioIcon, { backgroundColor: s.color + "22", borderColor: s.color + "55" }]}>
                  <Ionicons name={s.icon as never} size={22} color={s.color} />
                </View>
                <Text style={styles.scenarioJa}>{s.titleJa}</Text>
                <Text style={styles.scenarioTitle}>{s.title}</Text>
                <View style={styles.xpBadge}>
                  <Ionicons name="star" size={10} color={colors.primary} />
                  <Text style={styles.xpText}>+{s.xp} XP</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Word of the day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Word of the day</Text>
          <TouchableOpacity
            testID="home-word-of-day"
            activeOpacity={0.9}
            onPress={() => router.push("/vocab")}
            style={styles.wodCard}
          >
            <Text style={styles.wodJa}>{wordOfDay.word}</Text>
            <Text style={styles.wodReading}>{wordOfDay.reading}</Text>
            <Text style={[type.body, { marginTop: 4 }]}>{wordOfDay.meaning}</Text>
            <View style={styles.wodDivider} />
            <Text style={[type.small, { fontStyle: "italic" }]}>{wordOfDay.example}</Text>
            <Text style={[type.tiny, { color: colors.secondary, marginTop: 4 }]}>
              {wordOfDay.exampleRomaji}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learn more</Text>
          <View style={styles.quickRow}>
            <QuickCard
              testID="home-quick-vocab"
              icon="albums"
              label="Vocabulary"
              onPress={() => router.push("/vocab")}
            />
            <QuickCard
              testID="home-quick-grammar"
              icon="book"
              label="Grammar"
              onPress={() => router.push("/grammar")}
            />
          </View>
          <View style={[styles.quickRow, { marginTop: 12 }]}>
            <QuickCard
              testID="home-quick-jlpt"
              icon="ribbon"
              label="JLPT Hub"
              onPress={() => router.push("/jlpt")}
            />
            <QuickCard
              testID="home-quick-scenarios"
              icon="chatbox-ellipses"
              label="Scenarios"
              onPress={() => router.push("/scenarios")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickCard({
  icon,
  label,
  onPress,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.quickCard}
    >
      <Ionicons name={icon} size={26} color={colors.primary} />
      <Text style={[type.body, { marginTop: 8, fontWeight: "600" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingBottom: 24 },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,17,17,0.7)",
  },
  headerContent: { padding: spacing.screen, paddingTop: 12 },
  jaGreet: {
    color: colors.primary,
    fontSize: 14,
    letterSpacing: 4,
    fontWeight: "600",
    marginBottom: 6,
  },
  headerRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#221A0F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  streakText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  section: { marginTop: 28, paddingHorizontal: 0 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    marginBottom: 12,
  },
  sectionTitle: {
    ...type.h4,
    paddingHorizontal: spacing.screen,
    marginBottom: 12,
  },
  goalCard: {
    marginHorizontal: spacing.screen,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  levelBadgeSmall: {
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
  },
  continueCard: {
    marginHorizontal: spacing.screen,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1F1418",
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scenarioTile: {
    width: 148,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  scenarioIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 12,
  },
  scenarioJa: { fontSize: 18, fontWeight: "700", color: colors.text },
  scenarioTitle: { ...type.small, marginTop: 2 },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#1F1418",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  xpText: { color: colors.primary, fontSize: 11, fontWeight: "700" },
  wodCard: {
    marginHorizontal: spacing.screen,
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  wodJa: { fontSize: 40, fontWeight: "700", color: colors.text, letterSpacing: -1 },
  wodReading: { color: colors.secondary, fontSize: 15, marginTop: 4, fontWeight: "600" },
  wodDivider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  quickRow: { flexDirection: "row", gap: 12, paddingHorizontal: spacing.screen },
  quickCard: {
    flex: 1,
    padding: 20,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "flex-start",
  },
});
