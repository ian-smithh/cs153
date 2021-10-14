import React, {  } from "react";
import { StyleSheet, View } from "react-native";
import { Button, DataTable, useTheme, Text } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
const AppInfo = require("../app.json");
const AppInfoExpo = AppInfo.expo;

export default function About() {
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
