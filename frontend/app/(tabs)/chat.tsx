import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import { colors, spacing, radius, type } from "@/src/theme";
import { loadProfile, addXp, addStudyMinutes } from "@/src/store/user";
import { sendChat, ChatReply, ChatTurn } from "@/src/lib/api";
import { scenarios } from "@/src/data/scenarios";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: ChatReply;
  isError?: boolean;
};

export default function Chat() {
  const params = useLocalSearchParams<{ scenario?: string }>();
  const scenario = params.scenario ? scenarios.find((s) => s.id === params.scenario) : undefined;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState({ jlptLevel: "N5", nativeLanguage: "English" });
  const sessionId = useRef(`sess-${Date.now()}-${Math.floor(Math.random() * 9999)}`).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadProfile().then((p) => setProfile({ jlptLevel: p.jlptLevel, nativeLanguage: p.nativeLanguage }));
  }, []);

  // Seed opening line for scenario
  useEffect(() => {
    if (scenario) {
      const opener: Msg = {
        id: "opener",
        role: "assistant",
        text: scenario.starterAi,
        reply: {
          reply: scenario.starterAi,
          romaji: scenario.starterAiRomaji,
          translation: scenario.starterAiTranslation,
          grammar: scenario.context,
          jlpt: scenario.jlpt,
          difficulty: scenario.difficulty,
          vocabulary: scenario.vocabulary,
          suggestions: [],
        },
      };
      setMessages([opener]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [scenario?.id]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    const history: ChatTurn[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    try {
      const reply = await sendChat({
        sessionId,
        jlptLevel: profile.jlptLevel,
        nativeLanguage: profile.nativeLanguage,
        message: text,
        history,
        scenario: scenario?.context,
      });
      const aiMsg: Msg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: reply.reply,
        reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
      await addXp(5);
      await addStudyMinutes(1);
    } catch (e) {
      const err: Msg = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "Sorry, I couldn't reach the tutor. Please try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, err]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, messages, sessionId, profile, scenario]);

  return (
    <View style={styles.root} testID="chat-screen">
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>先生</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={type.h4}>{scenario ? scenario.title : "AI Tutor"}</Text>
            <Text style={[type.small, { marginTop: 2 }]}>
              {scenario ? `Role-play · ${scenario.jlpt}` : `Personal · ${profile.jlptLevel}`}
            </Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="sparkles" size={30} color={colors.primary} />
              </View>
              <Text style={type.h3}>こんにちは！</Text>
              <Text style={[type.small, { marginTop: 8, textAlign: "center", paddingHorizontal: 20 }]}>
                Say hi or ask anything in Japanese or {profile.nativeLanguage}.
                {"\n"}I&apos;ll reply with romaji, translation, and grammar tips.
              </Text>
              <View style={styles.starterRow}>
                {["こんにちは！", "Teach me a greeting", "Correct my Japanese"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    testID={`chat-starter-${s}`}
                    style={styles.starter}
                    onPress={() => setInput(s)}
                  >
                    <Text style={[type.small, { color: colors.text }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((m) => {
            if (m.role === "user") {
              return (
                <View key={m.id} style={styles.userWrap}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userText}>{m.text}</Text>
                  </View>
                </View>
              );
            }
            const isExp = expanded[m.id];
            return (
              <View key={m.id} style={styles.aiWrap}>
                <View style={[styles.aiBubble, m.isError && { borderColor: colors.danger }]}>
                  {m.reply ? (
                    <>
                      <View style={styles.aiHeader}>
                        <View style={styles.jlptTag}>
                          <Text style={styles.jlptTagText}>{m.reply.jlpt}</Text>
                        </View>
                        <View style={[styles.jlptTag, { backgroundColor: "#1B1B25", borderColor: colors.secondary }]}>
                          <Text style={[styles.jlptTagText, { color: colors.secondary }]}>{m.reply.difficulty}</Text>
                        </View>
                      </View>
                      <Text style={styles.aiJa}>{m.reply.reply}</Text>
                      <Text style={styles.aiRomaji}>{m.reply.romaji}</Text>
                      <TouchableOpacity
                        testID={`chat-expand-${m.id}`}
                        activeOpacity={0.7}
                        onPress={() => setExpanded((p) => ({ ...p, [m.id]: !p[m.id] }))}
                        style={styles.translationRow}
                      >
                        <Ionicons
                          name={isExp ? "chevron-up" : "chevron-down"}
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={[type.small, { marginLeft: 4 }]}>
                          {isExp ? "Hide details" : "Show translation & grammar"}
                        </Text>
                      </TouchableOpacity>
                      {isExp && (
                        <View style={styles.details}>
                          <DetailRow icon="language" label="Translation" text={m.reply.translation} />
                          <DetailRow icon="school" label="Grammar" text={m.reply.grammar} />
                          {m.reply.vocabulary.length > 0 && (
                            <View style={{ marginTop: 10 }}>
                              <Text style={styles.detailLabel}>Vocabulary</Text>
                              {m.reply.vocabulary.map((v, i) => (
                                <View key={i} style={styles.vocabRow}>
                                  <Text style={styles.vocabWord}>{v.word}</Text>
                                  <Text style={styles.vocabReading}>{v.reading}</Text>
                                  <Text style={[type.small, { flex: 1, textAlign: "right" }]}>{v.meaning}</Text>
                                </View>
                              ))}
                            </View>
                          )}
                          {m.reply.suggestions.length > 0 && (
                            <View style={{ marginTop: 10 }}>
                              <Text style={styles.detailLabel}>Try also</Text>
                              {m.reply.suggestions.map((s, i) => (
                                <Text key={i} style={styles.suggestion}>· {s}</Text>
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </>
                  ) : (
                    <Text style={styles.aiJa}>{m.text}</Text>
                  )}
                </View>
              </View>
            );
          })}
          {loading && (
            <View style={styles.aiWrap}>
              <View style={styles.aiBubble}>
                <ActivityIndicator color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            testID="chat-input"
            value={input}
            onChangeText={setInput}
            placeholder="Type in Japanese or English…"
            placeholderTextColor={colors.textTertiary}
            style={styles.textInput}
            multiline
            onSubmitEditing={send}
            editable={!loading}
          />
          <TouchableOpacity
            testID="chat-send-button"
            onPress={send}
            disabled={!input.trim() || loading}
            style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  text: string;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name={icon} size={14} color={colors.textSecondary} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={[type.body, { marginTop: 4, color: colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F1418",
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  list: { padding: 16, paddingBottom: 20, gap: 10 },
  empty: { paddingTop: 60, alignItems: "center" },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1F1418",
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  starterRow: { marginTop: 24, gap: 10, alignItems: "center" },
  starter: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
  },
  userWrap: { alignItems: "flex-end", marginTop: 6 },
  userBubble: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    padding: 14,
    maxWidth: "82%",
  },
  userText: { color: "#fff", fontSize: 16, lineHeight: 22 },
  aiWrap: { alignItems: "flex-start", marginTop: 8 },
  aiBubble: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: "90%",
  },
  aiHeader: { flexDirection: "row", gap: 6, marginBottom: 10 },
  jlptTag: {
    backgroundColor: "#1F1418",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  jlptTagText: { color: colors.primary, fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  aiJa: { color: colors.text, fontSize: 22, fontWeight: "600", lineHeight: 32 },
  aiRomaji: { color: colors.secondary, fontSize: 13, marginTop: 4, fontWeight: "500" },
  translationRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  details: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  vocabRow: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 8,
  },
  vocabWord: { color: colors.text, fontSize: 16, fontWeight: "700" },
  vocabReading: { color: colors.secondary, fontSize: 12 },
  suggestion: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    color: colors.text,
    fontSize: 16,
    padding: 14,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
