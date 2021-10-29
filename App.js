import { StatusBar } from "expo-status-bar";
import React, { useState, useMemo } from "react";
import { TouchableOpacity, Appearance } from "react-native";
import {
  NavigationContainer, DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider as PaperProvider, DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import merge from "deepmerge";

import HomeStack from "./components/Home";
import About from "./components/About";
import Settings from "./components/Settings";
import { PreferencesContext } from "./boot/Preferences";
import ThemeEnum from "./enums/ThemeEnum";
import LoadEnum from "./enums/LoadEnum";

const Root = createNativeStackNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export default function App() {
  const [userTheme, setUserTheme] = useState(ThemeEnum.AUTO);
  const [userLoadArticles, setUserLoadArticles] = useState(LoadEnum.XS);
  const systemSetting = Appearance.getColorScheme();

  let theme = userTheme === ThemeEnum.AUTO ? (systemSetting === "dark" ? CombinedDarkTheme : CombinedDefaultTheme) : userTheme === ThemeEnum.DARK ? CombinedDarkTheme : CombinedDefaultTheme;

  const preferences = useMemo(
    () => ({
      userTheme,
      setUserTheme,
      userLoadArticles,
      setUserLoadArticles
    }),
    [userTheme, setUserTheme, userLoadArticles, setUserLoadArticles]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <StatusBar style={theme === CombinedDarkTheme ? "light" : "dark"} />
          <Root.Navigator
            screenOptions={{
              headerTintColor: theme.colors.primary
            }}
          >
            <Root.Screen name="Home Stack" component={HomeStack} options={{ headerShown: false }} />
            <Root.Screen name="Settings Stack" component={Settings} options={{headerShown: false}} />
          </Root.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}