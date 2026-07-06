import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, radius, type, IMAGES } from "@/src/theme";
import { loadProfile, saveProfile } from "@/src/store/user";

type Level = "N5" | "N4" | "N3" | "N2" | "N1";

const LEVELS: { id: Level; label: string; desc: string }[] = [
  { id: "N5", label: "N5", desc: "Beginner — Hiragana, greetings, basic phrases" },
  { id: "N4", label: "N4", desc: "Elementary — Everyday conversation" },
  { id: "N3", label: "N3", desc: "Intermediate — News, social topics" },
  { id: "N2", label: "N2", desc: "Upper — Business, complex articles" },
  { id: "N1", label: "N1", desc: "Advanced — Native-level nuance" },
];

const GOALS = [5, 10, 15, 30, 60];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>("N5");
  const [goal, setGoal] = useState(15);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    const p = await loadProfile();
    p.name = name.trim() || "Learner";
    p.jlptLevel = level;
    p.dailyGoalMinutes = goal;
    p.onboarded = true;
    await saveProfile(p);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.root} testID="onboarding-screen">
      <ImageBackground
        source={{ uri: IMAGES.toriiNight }}
        style={styles.hero}
        imageStyle={{ opacity: 0.45 }}
      >
        <View style={styles.heroOverlay} />
        <SafeAreaView edges={["top"]} style={styles.heroContent}>
          <Text style={styles.jaBrand}>日本語</Text>
          <Text style={type.h1}>Master{"\n"}Japanese.</Text>
          <Text style={[type.body, { color: colors.textSecondary, marginTop: 8 }]}>
            An AI tutor in your pocket.
          </Text>
        </SafeAreaView>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheet}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.screen, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <>
              <Text style={type.h3}>What should we call you?</Text>
              <Text style={[type.small, { marginTop: 8 }]}>
                Your name stays on this device.
              </Text>
              <TextInput
                testID="onboarding-name-input"
                placeholder="Your name"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={() => setStep(1)}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Text style={type.h3}>Pick your JLPT level</Text>
              <Text style={[type.small, { marginTop: 8, marginBottom: 20 }]}>
                We&apos;ll tune every lesson to your level.
              </Text>
              {LEVELS.map((l) => (
                <TouchableOpacity
                  key={l.id}
                  testID={`onboarding-level-${l.id}`}
                  activeOpacity={0.85}
                  onPress={() => setLevel(l.id)}
                  style={[
                    styles.levelCard,
                    level === l.id && { borderColor: colors.primary },
                  ]}
                >
                  <View style={[styles.levelBadge, level === l.id && { backgroundColor: colors.primary }]}>
                    <Text style={styles.levelBadgeText}>{l.label}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={type.h4}>{l.label} Level</Text>
                    <Text style={[type.small, { marginTop: 2 }]}>{l.desc}</Text>
                  </View>
                  {level === l.id ? (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <Text style={type.h3}>Daily goal</Text>
              <Text style={[type.small, { marginTop: 8, marginBottom: 20 }]}>
                Consistency beats intensity. Start small.
              </Text>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g}
                  testID={`onboarding-goal-${g}`}
                  activeOpacity={0.85}
                  onPress={() => setGoal(g)}
                  style={[
                    styles.goalCard,
                    goal === g && { borderColor: colors.primary, backgroundColor: "#1F1418" },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={22}
                    color={goal === g ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[type.body, { marginLeft: 12, flex: 1 }]}>
                    {g} minutes / day
                  </Text>
                  {goal === g ? (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 3 && (
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <View style={styles.readyGlow}>
                <Text style={{ fontSize: 48 }}>🎌</Text>
              </View>
              <Text style={[type.h2, { textAlign: "center", marginTop: 20 }]}>
                Ready, {name.trim() || "Learner"}?
              </Text>
              <Text style={[type.body, { color: colors.textSecondary, textAlign: "center", marginTop: 8 }]}>
                {level} · {goal} min/day{"\n"}Let&apos;s begin.
              </Text>
            </View>
          )}

          <View style={{ height: 32 }} />
          <TouchableOpacity
            testID="onboarding-continue-button"
            activeOpacity={0.85}
            style={styles.primaryBtn}
            disabled={saving}
            onPress={() => {
              if (step < 3) setStep((step + 1) as 1 | 2 | 3);
              else finish();
            }}
          >
            <Text style={styles.primaryBtnText}>
              {step === 3 ? (saving ? "Starting…" : "Start Learning") : "Continue"}
            </Text>
          </TouchableOpacity>
          {step > 0 && (
            <TouchableOpacity
              testID="onboarding-back-button"
              onPress={() => setStep((step - 1) as 0 | 1 | 2)}
              style={{ alignSelf: "center", padding: 12 }}
            >
              <Text style={[type.small]}>Back</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { height: 340 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,17,17,0.55)",
  },
  heroContent: { flex: 1, padding: spacing.screen, justifyContent: "flex-end" },
  jaBrand: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: 8,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    marginTop: 20,
    padding: 18,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 18,
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: { color: colors.text, fontWeight: "700", fontSize: 14 },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryBtnText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.2 },
  readyGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1F1418",
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
