import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/src/theme";
import { loadProfile } from "@/src/store/user";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await loadProfile();
      // Small delay so splash is smooth
      setTimeout(() => {
        if (p.onboarded) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      }, 200);
    })();
  }, [router]);

  return (
    <View style={styles.container} testID="app-splash">
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
