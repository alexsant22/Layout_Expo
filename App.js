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
import Gestual1Screen from "./src/screens/Gestual1";
import RotationScreen from "./src/screens/RotationScreen";
import PitchZoomScreen from "./src/screens/PitchZoomScreen";
import LongPressScreen from "./src/screens/LongPressScreen";
import FlatListScreen from "./src/screens/FlatList";
import LocationScreen from "./src/screens/LocationScreen";
import SomScreen from "./src/screens/SomScreen";
import MapaScreen from "./src/screens/MapaScreen";

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

        <Drawer.Screen
          name="Gestual"
          component={Gestual1Screen}
          options={{ title: "Gestual" }}
        />

        <Drawer.Screen
          name="Rotação"
          component={RotationScreen}
          options={{ title: "Rotação" }}
        />

        <Drawer.Screen
          name="Zoom"
          component={PitchZoomScreen}
          options={{ title: "Zoom" }}
        />

        <Drawer.Screen
          name="Long Press"
          component={LongPressScreen}
          options={{ title: "Long Press" }}
        />
        <Drawer.Screen
          name="FlatList"
          component={FlatListScreen}
          options={{ title: "FlatList" }}
        />
        <Drawer.Screen
          name="Localização"
          component={LocationScreen}
          options={{ title: "Localização" }}
        />
        <Drawer.Screen
          name="Som"
          component={SomScreen}
          options={{ title: "Som" }}
        />
        <Drawer.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: "Mapa" }}
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
