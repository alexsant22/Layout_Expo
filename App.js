import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";

import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Main from "./src/components/Main";
import Menu from "./src/components/Menu";

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Header />

        <Main />

        <Footer />
      </ScrollView>

      <Menu />
    </View>
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
