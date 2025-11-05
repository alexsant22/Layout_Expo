import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
export default function App() {
  const [message, setMessage] = useState("Pressione e segure o quadrado ");
  const onLongPress = () => {
    setMessage(" Você fez um toque longo!");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>
      <LongPressGestureHandler onActivated={onLongPress} minDurationMs={1000}>
        <View style={styles.box}>
          <Text style={styles.boxText}>Segure-me</Text>
        </View>
      </LongPressGestureHandler>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "#FF6347",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  boxText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
