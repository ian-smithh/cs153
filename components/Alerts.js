/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { Button, TextInput, Switch, useTheme, List, FAB, Dialog, Portal, IconButton, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet, FlatList, Text } from "react-native";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import AlertEnum from "../enums/AlertEnum";

export function AlertsSettings({ route, navigation }) {
  const [keywords, setKeywords] = useState([]);
  const [alertsOn, setAlertsOn] = useState(true);
  const [showNewAlertBox, setShowNewAlertBox] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [queryEnableAlerts, setQueryEnableAlerts] = useState(false);
  const theme = useTheme();
  const navAlertsOn = route.params.alertsOn;
  const navDisableFetch = route.params.disableFetch;
  const navKeywords = route.params.keywords;

  useEffect(() => {
    async function loadSettings() {
      let enabled = false;
      //await AsyncStorage.getItem(AlertEnum.USER_ENABLE_DISABLE_STATE);
      let keywords = false;
      //await AsyncStorage.getItem(AlertEnum.USER_ALERT_KEYWORDS);

      if (enabled) {
        setAlertsOn(enabled);
      }
      else {
        setAlertsOn(navAlertsOn);
      }
      if (keywords) {
        setKeywords(JSON.parse(keywords));
      }
      else {
        setKeywords(navKeywords);
      }
    }
    loadSettings();
  }, []);

  /**
   * Render a keyword alert item.
   * @param {*} item 
   * @returns 
   */
  function renderKeywordItem(item) {
    return (
      <List.Item
        title={item.item}
        right={props => <IconButton {...props} icon="bell-cancel" onPress={() => removeAlert(item)} />}
      />
    );
  }

  /**
   * What to render when the array is empty.
   * @returns 
   */
  function renderEmpty() {
    return (
      <List.Item
        title={"No alerts found."}
        description={"Once you add an alert, it will appear here."}
        right={props => <List.Icon {...props} icon="bell-cancel" />}
      />
    );
  }

  /**
   * Hide the new alert keyword dialog box.
   */
  function hideNewAlertDialog() {
    setShowNewAlertBox(false);
  }

  function hideQueryEnableAlerts() {
    setQueryEnableAlerts(false);
  }

  /**
   * Add a new alert keyword to the array.
   */
  async function saveNewAlert() {
    setShowNewAlertBox(false);
    if (keywords.includes(userInput)) {
      setSnackbarMessage(AlertEnum.SNACKBAR_DUPLICATE_ALERT.replace("%keyword%", userInput));
      setShowSnackbar(true);
      setUserInput("");
    }
    else {
      let newKeywords = keywords;
      newKeywords.push(userInput);
      setKeywords(newKeywords);
      setSnackbarMessage(AlertEnum.SNACKBAR_ADDED_ALERT.replace("%keyword%", userInput));
      setUserInput("");
      setShowSnackbar(true);
      await AsyncStorage.setItem(AlertEnum.USER_ALERT_KEYWORDS, JSON.stringify(newKeywords))
        .then(() => {
          console.log("saved", AlertEnum.USER_ALERT_KEYWORDS);
        });
    }
  }

  /**
   * Delete an alert keyword from the array.
   * @param {*} alert 
   */
  async function removeAlert(alert) {
    let newKeywords = keywords;
    newKeywords = newKeywords.filter(keyword => keyword != alert.item);
    await AsyncStorage.setItem(AlertEnum.USER_ALERT_KEYWORDS, JSON.stringify(newKeywords))
      .then(() => {
        console.log("saved", AlertEnum.USER_ALERT_KEYWORDS);
      });
    setKeywords(newKeywords);
    setSnackbarMessage(AlertEnum.SNACKBAR_REMOVED_ALERT.replace("%keyword%", alert.item));
    setShowSnackbar(true);
  }

  /**
   * Save user preferences to local storage.
   */
  async function save() {
    await AsyncStorage.setItem(AlertEnum.USER_ENABLE_DISABLE_STATE, alertsOn ? "true" : "false")
      .then(() => {
        console.log("saved", AlertEnum.USER_ENABLE_DISABLE_STATE);
      });
    await AsyncStorage.setItem(AlertEnum.USER_ALERT_KEYWORDS, JSON.stringify(keywords))
      .then(() => {
        console.log("saved", AlertEnum.USER_ALERT_KEYWORDS);
      });
    console.log("Saved to local storage.");
  }

  async function toggleAlerts(value) {
    console.log("new value for alerts:", value);
    setAlertsOn(value);
    await AsyncStorage.setItem(AlertEnum.USER_ENABLE_DISABLE_STATE, value ? "true" : "false")
      .then(() => {
        console.log("saved", AlertEnum.USER_ENABLE_DISABLE_STATE);
      });
  }

  /**
   * Execute when FAB is pressed.
   */
  function onFAB() {
    if (!alertsOn) {
      setQueryEnableAlerts(true);
    }
    setShowNewAlertBox(true);
  }

  /**
   * Reenable alerts for the user and hide the correct dialog box.
   */
  async function reenableAlerts() {
    setAlertsOn(true);
    await AsyncStorage.setItem(AlertEnum.USER_ENABLE_DISABLE_STATE, "true")
      .then(() => {
        console.log("saved", AlertEnum.USER_ENABLE_DISABLE_STATE);
      });
    setShowNewAlertBox(true);
    setQueryEnableAlerts(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Item
        title={"Alerts"}
        description={"Enable or disable alerts"}
        right={props => <Switch value={alertsOn} onValueChange={(value) => toggleAlerts(value)} theme={theme} color={theme.colors.primary} />}
      >
      </List.Item>
      <FlatList
        data={keywords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => renderKeywordItem(item)}
        ListEmptyComponent={() => renderEmpty()}
        extraData={showNewAlertBox}
      />
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          color: theme.colors.primary,
          backgroundColor: theme.colors.primary,
        }}
        icon="plus"
        onPress={() => onFAB()}
        theme={theme}
      />
      <Portal>
        <Dialog visible={queryEnableAlerts} onDismiss={hideQueryEnableAlerts}>
          <Dialog.Title>Enable Alerts?</Dialog.Title>
          <Dialog.Content>
            <Text>In order to add a new alert, you will need to enable alerts first. Click Ok to proceed.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => hideQueryEnableAlerts()}>Cancel</Button>
            <Button onPress={() => reenableAlerts()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={showNewAlertBox && !queryEnableAlerts} onDismiss={hideNewAlertDialog}>
          <Dialog.Title>Create New Alert</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Alert keyword"
              dense={true}
              value={userInput}
              onChangeText={text => setUserInput(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setQueryEnableAlerts(false)}>Cancel</Button>
            <Button onPress={() => saveNewAlert()}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>

    </View>
  );
}

export function AlertsDisplay({ articles }) {
  const [keywords, setKeywords] = useState([]);
  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    async function loadSettings() {
      let keywords = await AsyncStorage.getItem(AlertEnum.USER_ALERT_KEYWORDS);

      if (keywords) {
        setKeywords(JSON.parse(keywords));
      }
    }

    loadSettings();
  }, []);

  /**
   * Filter the articles prop to only include elements found in the user's keywords.
   * @returns articles prop filtered to only include elements found in the user's keywords.
   */
  function filterArticlesWithKeywords() {
    return articles;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Button contentStyle={styles.settingsButtonInner} style={styles.settingsButton} mode="contained" icon="bell-alert" onPress={() => navigation.navigate("Settings Stack", { screen: "Alerts Settings" })}>Edit Alerts</Button>
      <FlatList
        data={articles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => <Text>{item.item.title}</Text>}
      />
    </View>
  );
}

AlertsDisplay.propTypes = {
  articles: PropTypes.array,
};

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
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
