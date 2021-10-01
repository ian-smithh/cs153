import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList, useColorScheme, Image, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { parse } from "fast-xml-parser";
import { DefaultTheme, Provider as PaperProvider, Card, Title, Paragraph, Chip, Button, Menu, DataTable, TextInput, useTheme, Text } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";
const AppInfo = require("./app.json");
const AppInfoExpo = AppInfo.expo;
const logo = require("./assets/Microsoft_logo.svg.png");

const Root = createNativeStackNavigator();

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
          <Root.Screen name="Home" component={Home}
            headerMode={"screen"}
            options={({ navigation, route }) => ({
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                  <MaterialIcons name="settings" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              )
            })}
          />
          <Root.Screen name="About" component={About}
            headerMode={"screen"}
          />
          <Root.Screen name="Settings" component={Settings}
            headerMode={"screen"}
            options={({ navigation, route }) => ({
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

function Home() {
  const [patch, setPatch] = useState("");
  const [originalPatch, setOriginalPatch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  useEffect(() => {
    async function fetchRSS() {
      fetch("https://support.microsoft.com/en-us/feed/rss/6ae59d69-36fc-8e4d-23dd-631d98bf74a9")
        .then((response) => response.text())
        .then((textResponse) => {
          let obj = parse(textResponse);
          let rssData = obj.rss.channel.item;
          setPatch(rssData.slice(0, 50));
          setOriginalPatch(rssData.slice(0, 50));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchRSS();
  }, []);

  async function openBrowser(url) {
    await WebBrowser.openBrowserAsync(url);
  }

  /**
   * Filter the title, description of fetched data to look for the search term.
   * @param {String} text 
   */
  function handleSearch(text) {
    text = text.toLowerCase();
    if (text === "") {
      setPatch(originalPatch);
      setSearchTerm("");
    }
    else {
      setPatch(originalPatch.filter(item => (item.title.includes(text) || item.description.includes(text))));
    }
  }

  function renderArticle(item) {
    return (
      <Card style={styles.card}>
        <Card.Title subtitle={item.pubDate} />
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => openBrowser(item.link)}>Open</Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        icon="text-search"
        mode="flat"
        label="Enter a search term"
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
        onSubmitEditing={() => handleSearch(searchTerm)}
        right={<TextInput.Icon name="filter-variant-remove" onPress={() => handleSearch("")} />}
      />
      <ScrollView contentContainerStyle={styles.chipContainer} horizontal={true}>
        <Chip icon="calendar-today" style={styles.chip}>Today</Chip>
        <Chip icon="calendar-week" style={styles.chip}>This week</Chip>
        <Chip icon="calendar-month" style={styles.chip}>This month</Chip>
        <Chip icon="help-circle" style={styles.chip}>Support articles</Chip>
        <Chip icon="update" style={styles.chip}>KB articles</Chip>
      </ScrollView>
      <FlatList
        data={patch}
        extraData={searchTerm}
        renderItem={(item) => renderArticle(item.item)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

function About() {
  const theme = useTheme();
  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Item</DataTable.Title>
          <DataTable.Title>Key</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>Name</DataTable.Cell>
          <DataTable.Cell>{AppInfoExpo.name}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Slug</DataTable.Cell>
          <DataTable.Cell>{AppInfoExpo.slug}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Version</DataTable.Cell>
          <DataTable.Cell>{AppInfoExpo.version}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Orientation</DataTable.Cell>
          <DataTable.Cell>{AppInfoExpo.orientation}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Updates</DataTable.Cell>
          <DataTable.Cell>{JSON.stringify(AppInfoExpo.updates)}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>iOS</DataTable.Cell>
          <DataTable.Cell>{JSON.stringify(AppInfoExpo.ios)}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Android</DataTable.Cell>
          <DataTable.Cell>{JSON.stringify(AppInfoExpo.android)}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Web</DataTable.Cell>
          <DataTable.Cell>{JSON.stringify(AppInfoExpo.web)}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <Button icon="content-copy" onPress={() => Clipboard.setString(JSON.stringify(AppInfoExpo))} mode="contained" style={styles.clipboardButton}>Copy Debug Info to Clipboard</Button>
      <Text style={{ alignSelf: "center", color: theme.colors.backdrop }}>Version {AppInfoExpo.version}</Text>
    </View>
  );
}

function Settings() {
  const [theme, setTheme] = useState(ThemeEnum.LIGHT);
  const [toLoad, setToLoad] = useState(50);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const [loadMenuVisible, setLoadMenuVisible] = useState(false);
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
          <Button contentStyle={styles.settingsButtonInner} style={styles.settingsButton} mode="contained" icon="numeric" onPress={() => setLoadMenuVisible(true)}>Set number of articles to load</Button>
        }>
        <Menu.Item onPress={() => setToLoad(LoadEnum.SMALL)} title={LoadEnum.SMALL} />
        <Menu.Item onPress={() => setToLoad(LoadEnum.MED)} title={LoadEnum.MED} />
        <Menu.Item onPress={() => setToLoad(LoadEnum.LARGE)} title={LoadEnum.LARGE} />
        <Menu.Item onPress={() => setToLoad(LoadEnum.XL)} title={LoadEnum.XL} />
      </Menu>
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

const ThemeEnum = {
  DARK: "dark",
  LIGHT: "light",
  AUTO: "auto"
};

const LoadEnum = {
  SMALL: 50,
  MED: 100,
  LARGE: 250,
  XL: 500,
};
