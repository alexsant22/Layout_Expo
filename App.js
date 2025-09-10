import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Main from "./src/components/Main";
import Menu from "./src/components/Menu";

import HomeScreen from "./src/screens/HomeScreen";
import ConfigScreen from "./src/screens/ConfigScreen";
import PerfilScreen from "./src/screens/PerfilScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    /*     <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Header />

        <Main />

        <Footer />
      </ScrollView>

      <Menu />
    </View> */
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Drawer.Screen
          name="Configuração"
          component={ConfigScreen}
          options={{ title: "Config" }}
        />
        <Drawer.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ title: "Perfil" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});
