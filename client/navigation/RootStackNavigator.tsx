import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import StockDetailScreen from "@/screens/StockDetailScreen";
import SearchModalScreen from "@/screens/SearchModalScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  StockDetail: { symbol: string };
  SearchModal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StockDetail"
        component={StockDetailScreen}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="SearchModal"
        component={SearchModalScreen}
        options={{
          presentation: "modal",
          headerTitle: "Search Stocks",
        }}
      />
    </Stack.Navigator>
  );
}
