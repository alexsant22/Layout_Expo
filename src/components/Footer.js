import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>2025 Meu App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 15,
    backgroundColor: "#6200EE",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
  },
});
