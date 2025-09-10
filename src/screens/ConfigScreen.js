import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de configuração</Text>
      <Text style={styles.text}>Abra o menu Lateral</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 24,
    color: "#555",
  },
});
