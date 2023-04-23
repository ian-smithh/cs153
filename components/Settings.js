import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Button, Menu, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
const logo = require("../assets/Microsoft_logo.svg.png");
import ThemeEnum from "../enums/ThemeEnum";
import LoadEnum from "../enums/LoadEnum";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertEnum from "../enums/AlertEnum";
import { PreferencesContext } from "../boot/Preferences";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import About from "./About";
import { AlertsSettings } from "./Alerts";

const SettingsNavigator = createNativeStackNavigator();

export default function SettingsStack() {
  const theme = useTheme();
  return (
    <SettingsNavigator.Navigator screenOptions={{
      headerShown: true,
    }}>
      <SettingsNavigator.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("About")}>
              <MaterialIcons name="info" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )
        })}
      />
      <SettingsNavigator.Screen name="About" component={About} />
      <SettingsNavigator.Screen name="Alerts Settings" component={AlertsSettings}
        initialParams={{ keywords: [], alertsOn: true, disableFetch: false }} />
    </SettingsNavigator.Navigator>
  );
}

function Settings() {
  // eslint-disable-next-line no-unused-vars
  const { userTheme, setUserTheme, userLoadArticles, setUserLoadArticles } = useContext(PreferencesContext);
  // eslint-disable-next-line no-unused-vars
  const [toLoad, setToLoad] = useState(50);
  const [keywords, setKeywords] = useState(["security", "kb"]);
  const [alertsOn, setAlertsOn] = useState(true);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const [loadMenuVisible, setLoadMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadSettings() {
      await AsyncStorage.getItem(AlertEnum.USER_ENABLE_DISABLE_STATE)
        .then((result) => {
          //console.log(result);
          if (result !== undefined && result !== null) {
            setAlertsOn(result === "true");
          }
        });
      await AsyncStorage.getItem(AlertEnum.USER_ALERT_KEYWORDS)
        .then((result) => {
          //console.log(result);
          if (result !== undefined && result !== null) {
            setKeywords(JSON.parse(result));
          }
        });
    }
    loadSettings();
  }, []);

  async function purge() {
    await AsyncStorage.clear().then((res) => console.log("Cleared async storage result was", res));
  }

  return (
    <View style={styles.container}>
      <Menu
        visible={themeMenuVisible}
        onDismiss={() => setThemeMenuVisible(false)}
        anchor={
          <Button contentStyle={styles.settingsButtonInner} style={styles.settingsButton} mode="contained" icon="theme-light-dark" onPress={() => setThemeMenuVisible(true)}>Set theme</Button>
        }
      >
        <Menu.Item onPress={() => { setUserTheme(ThemeEnum.LIGHT); }} title={ThemeEnum.LIGHT} />
        <Menu.Item onPress={() => { setUserTheme(ThemeEnum.DARK); }} title={ThemeEnum.DARK} />
        <Menu.Item onPress={() => { setUserTheme(ThemeEnum.AUTO); }} title={ThemeEnum.AUTO} />
      </Menu>
      <Menu
        visible={loadMenuVisible}
        onDismiss={() => setLoadMenuVisible(false)}
        anchor={
          <Button
            contentStyle={styles.settingsButtonInner}
            style={styles.settingsButton}
            mode="contained"
            icon="numeric"
            onPress={() => setLoadMenuVisible(true)}>Set number of articles to load</Button>
        }>
        <Menu.Item onPress={() => setUserLoadArticles(LoadEnum.XS)} title={LoadEnum.XS} />
        <Menu.Item onPress={() => setUserLoadArticles(LoadEnum.SMALL)} title={LoadEnum.SMALL} />
        <Menu.Item onPress={() => setUserLoadArticles(LoadEnum.MED)} title={LoadEnum.MED} />
        <Menu.Item onPress={() => setUserLoadArticles(LoadEnum.LARGE)} title={LoadEnum.LARGE} />
        <Menu.Item onPress={() => setUserLoadArticles(LoadEnum.XL)} title={LoadEnum.XL} />
      </Menu>
      <Button
        contentStyle={styles.settingsButtonInner}
        style={styles.settingsButton}
        mode="contained"
        icon="bell-alert"
        onPress={() => navigation.navigate("Settings Stack",
          {
            screen: "Alerts Settings",
            params: { keywords: keywords, alertsOn: alertsOn, disableFetch: true }
          })}>
        Alerts
      </Button>
      <Button
        contentStyle={styles.settingsButtonInner}
        style={styles.settingsButton}
        mode="contained"
        icon="delete-sweep"
        onPress={() => purge()}>
        Clear AsyncStorage
      </Button>
      <Image source={logo} style={{ flex: 1, height: null, width: null, margin: 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  headline: {
    fontSize: 18,
    fontWeight: "bold"
  },
  card: {
    marginVertical: 5,
  },
  clipboardButton: {
    margin: 10,
  },
  settingsButton: {
    margin: 10,
    marginVertical: 5,
  },
  settingsButtonInner: {
    justifyContent: "flex-start"
  },
  searchFab: {
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
  },
  headerButtons: {
    flexDirection: "row"
  },
  headerButtonInner: {
    marginHorizontal: 10,
  },
  chipContainer: {
    margin: 10,
  },
  chip: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2
  }
});
