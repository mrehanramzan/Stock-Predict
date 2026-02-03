import React from "react";
import { StyleSheet, View, Image, Pressable, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const handleToggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(!notificationsEnabled);
  };

  const appVersion = Constants.expoConfig?.version || "1.0.0";

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/images/avatar-preset.png")}
          style={styles.avatar}
        />
        <ThemedText style={styles.userName}>Stock Investor</ThemedText>
        <ThemedText style={[styles.userSubtitle, { color: theme.textSecondary }]}>
          Track stocks and get AI predictions
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Preferences
        </ThemedText>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color={theme.text} />
              <ThemedText style={styles.settingLabel}>
                Price Alerts
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.buttonText}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name={isDark ? "moon" : "sun"} size={20} color={theme.text} />
              <ThemedText style={styles.settingLabel}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </ThemedText>
            </View>
            <ThemedText style={[styles.settingValue, { color: theme.textSecondary }]}>
              System
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          About
        </ThemedText>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="info" size={20} color={theme.text} />
              <ThemedText style={styles.settingLabel}>Version</ThemedText>
            </View>
            <ThemedText style={[styles.settingValue, { color: theme.textSecondary }]}>
              {appVersion}
            </ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="shield" size={20} color={theme.text} />
              <ThemedText style={styles.settingLabel}>Privacy Policy</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="file-text" size={20} color={theme.text} />
              <ThemedText style={styles.settingLabel}>Terms of Service</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </View>
        </View>
      </View>

      <ThemedText style={[styles.disclaimer, { color: theme.textSecondary }]}>
        Stock predictions are for informational purposes only and should not be
        considered financial advice. Always do your own research before making
        investment decisions.
      </ThemedText>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  userSubtitle: {
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  settingsCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: 15,
  },
  settingValue: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.lg + 20 + Spacing.md,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: Spacing.lg,
  },
});
