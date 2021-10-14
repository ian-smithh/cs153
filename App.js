import { StatusBar } from "expo-status-bar";
import React, { createContext } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import HomeStack from "./components/Home";
import About from "./components/About";
import Settings from "./components/Settings";

const Root = createNativeStackNavigator();
export const ArticleStore = createContext();

export default function App() {
  const theme = {
    ...DefaultTheme,
    dark: useColorScheme() === "dark",
    colors: {
      ...DefaultTheme.colors,
    },
  };

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <Root.Navigator
          screenOptions={{
            headerTintColor: theme.colors.primary
          }}
        >
          <Root.Screen name="Home Stack" component={HomeStack} options={{headerShown: false}}/>
          <Root.Screen name="About" component={About}
            headerMode={"screen"}
          />
          <Root.Screen name="Settings" component={Settings}
            headerMode={"screen"}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("About")}>
                  <MaterialIcons name="info" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              )
            })}
          />
        </Root.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
