import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Button, Menu } from "react-native-paper";
const logo = require("../assets/Microsoft_logo.svg.png");
import ThemeEnum from "../enums/ThemeEnum";
import LoadEnum from "../enums/LoadEnum";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertEnum from "../enums/AlertEnum";

export default function Settings() {
  const [theme, setTheme] = useState(ThemeEnum.LIGHT);
  const [toLoad, setToLoad] = useState(50);
  const [keywords, setKeywords] = useState(["security", "kb"]);
  const [alertsOn, setAlertsOn] = useState(true);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const [loadMenuVisible, setLoadMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadSettings() {
      let loaded_enabled = await AsyncStorage.getItem(AlertEnum.USER_ENABLE_DISABLE_STATE)
        .then((result) => {
          console.log(result);
          if(result!== undefined && result!==null){
            setAlertsOn(result === "true" ? true : false);
          }
        });
      let loaded_keywords = await AsyncStorage.getItem(AlertEnum.USER_ALERT_KEYWORDS)
        .then((result) => {
          console.log(result);
          if(result !== undefined && result !== null){
            setKeywords(JSON.parse(result));
          }
        });
    }
    loadSettings();
  }, []);

  async function purge() {
    await AsyncStorage.clear();
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
        <Menu.Item onPress={() => { setTheme(ThemeEnum.LIGHT); }} title={ThemeEnum.LIGHT} />
        <Menu.Item onPress={() => { setTheme(ThemeEnum.DARK); }} title={ThemeEnum.DARK} />
        <Menu.Item onPress={() => { setTheme(ThemeEnum.AUTO); }} title={ThemeEnum.AUTO} />
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
        <Menu.Item onPress={() => setToLoad(LoadEnum.SMALL)} title={LoadEnum.SMALL} />
        <Menu.Item onPress={() => setToLoad(LoadEnum.MED)} title={LoadEnum.MED} />
        <Menu.Item onPress={() => setToLoad(LoadEnum.LARGE)} title={LoadEnum.LARGE} />
        <Menu.Item onPress={() => setToLoad(LoadEnum.XL)} title={LoadEnum.XL} />
      </Menu>
      <Button
        contentStyle={styles.settingsButtonInner}
        style={styles.settingsButton}
        mode="contained"
        icon="bell-alert"
        onPress={() => navigation.navigate("Home Stack",
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
