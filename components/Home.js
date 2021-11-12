import React, { useState, useEffect, createContext, useContext } from "react";
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { parse } from "fast-xml-parser";
import { Card, Title, Paragraph, Chip, Button, TextInput, useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AlertsDisplay } from "./Alerts";
import { PreferencesContext } from "../boot/Preferences";
import HomeSort from "../enums/SortEnum";

export const StoredArticles = createContext("default value");
const HomeNavigator = createNativeStackNavigator();

export default function HomeStack() {
  const theme = useTheme();
  return (
    <HomeNavigator.Navigator initialRouteName={"Home"} screenOptions={{
      headerShown: true,
    }}>
      <HomeNavigator.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => navigation.navigate("Alerts")} style={{ marginHorizontal: 10 }}>
                <MaterialCommunityIcons name="bell" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Settings Stack")}>
                <MaterialIcons name="settings" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )
        })} />
      <HomeNavigator.Screen name="Alerts" component={AlertsDisplay} />
    </HomeNavigator.Navigator>
  );
}

function Home() {
  const [patch, setPatch] = useState("");
  const [originalPatch, setOriginalPatch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const theme = useTheme();
  const { userTheme, setUserTheme, userLoadArticles, setUserLoadArticles } = useContext(PreferencesContext);

  useEffect(() => {
    async function fetchRSS() {
      fetch("https://support.microsoft.com/en-us/feed/rss/6ae59d69-36fc-8e4d-23dd-631d98bf74a9")
        .then((response) => response.text())
        .then((textResponse) => {
          let obj = parse(textResponse);
          let rssData = obj.rss.channel.item;
          setPatch(rssData.slice(0, userLoadArticles));
          setOriginalPatch(rssData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchRSS();
  }, []);

  /**
   * Open the given URL in the browser.
   * @param {String} url 
   */
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
      setPatch(originalPatch.slice(0, userLoadArticles));
      setSearchTerm("");
    }
    else {
      setPatch(originalPatch.filter(item => (item.title.includes(text) || item.description.includes(text))));
    }
  }

  /**
   * Render an article into a card.
   * @param {} item 
   * @returns 
   */
  function renderArticle(item) {
    return (
      <Card style={styles.card}>
        <Card.Title subtitle={item.pubDate} />
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button icon="open-in-app" onPress={() => openBrowser(item.link)}>Open</Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <StoredArticles.Provider value={patch}>
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
          <Chip icon="calendar-today" style={styles.chip} 
            onPress={()=> setSort(HomeSort.DATE_TODAY)}
            onClose={()=> setSort("")}
            selected={sort === HomeSort.DATE_TODAY}>Today</Chip>
          <Chip icon="calendar-week" style={styles.chip} 
            onPress={() => setSort(HomeSort.DATE_WEEK)}
            onClose={()=> setSort("")}
            selected={sort === HomeSort.DATE_WEEK}>This week</Chip>
          <Chip icon="calendar-month" style={styles.chip} 
            onPress={() => setSort(HomeSort.DATE_MONTH)}
            onClose={()=> setSort("")}
            selected={sort === HomeSort.DATE_MONTH}>This month</Chip>
          <Chip icon="help-circle" style={styles.chip} 
            onPress={() => setSort(HomeSort.CONTENT_HELP)}
            onClose={()=> setSort("")}
            selected={sort === HomeSort.CONTENT_HELP}>Support articles</Chip>
          <Chip icon="update" style={styles.chip} 
            onPress={() => setSort(HomeSort.CONTENT_UPDATE)}
            onClose={()=> setSort("")}
            selected={sort === HomeSort.CONTENT_UPDATE}>KB articles</Chip>
        </ScrollView>
        <FlatList
          data={patch}
          extraData={[userLoadArticles, searchTerm]}
          renderItem={(item) => renderArticle(item.item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </StoredArticles.Provider>
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
