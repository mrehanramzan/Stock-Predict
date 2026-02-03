import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MarketsScreen from "@/screens/MarketsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type MarketsStackParamList = {
  Markets: undefined;
};

const Stack = createNativeStackNavigator<MarketsStackParamList>();

export default function MarketsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Markets"
        component={MarketsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
