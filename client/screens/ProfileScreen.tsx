import React from "react";
import { StyleSheet, View, Image, Pressable, Switch, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { user, signOut } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const handleToggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
  };

  const appVersion = Constants.expoConfig?.version || "1.0.0";

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#1e3a5f20", "transparent"]
            : ["#dbeafe40", "transparent"]
        }
        style={styles.headerGradient}
      />
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </ThemedText>
          </View>
          <ThemedText style={styles.userName}>{user?.name || "User"}</ThemedText>
          <ThemedText style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email || "user@example.com"}
          </ThemedText>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>12</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Watchlist
            </ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>8</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Predictions
            </ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: theme.positive }]}>+12%</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Accuracy
            </ThemedText>
          </View>
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
                <View style={[styles.settingIcon, { backgroundColor: `${theme.primary}15` }]}>
                  <Feather name="bell" size={18} color={theme.primary} />
                </View>
                <ThemedText style={styles.settingLabel}>
                  Price Alerts
                </ThemedText>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${theme.primary}15` }]}>
                  <Feather name={isDark ? "moon" : "sun"} size={18} color={theme.primary} />
                </View>
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
                <View style={[styles.settingIcon, { backgroundColor: `${theme.primary}15` }]}>
                  <Feather name="info" size={18} color={theme.primary} />
                </View>
                <ThemedText style={styles.settingLabel}>Version</ThemedText>
              </View>
              <ThemedText style={[styles.settingValue, { color: theme.textSecondary }]}>
                {appVersion}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Pressable style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${theme.primary}15` }]}>
                  <Feather name="shield" size={18} color={theme.primary} />
                </View>
                <ThemedText style={styles.settingLabel}>Privacy Policy</ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleSignOut}
          style={[
            styles.signOutButton,
            { backgroundColor: `${theme.negative}10`, borderColor: theme.negative },
          ]}
        >
          <Feather name="log-out" size={18} color={theme.negative} />
          <ThemedText style={[styles.signOutText, { color: theme.negative }]}>
            Sign Out
          </ThemedText>
        </Pressable>

        <ThemedText style={[styles.disclaimer, { color: theme.textSecondary }]}>
          Stock predictions are for informational purposes only and should not be
          considered financial advice.
        </ThemedText>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 14,
  },
  statsCard: {
    flexDirection: "row",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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
    borderRadius: BorderRadius.lg,
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
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 15,
  },
  settingValue: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.lg + 36 + Spacing.md,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
