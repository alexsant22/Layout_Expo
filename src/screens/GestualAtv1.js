import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
export default function App() {
  const [count, setCount] = useState(0);
  const onSingleTap = () => {
    setCount(count + 1);
  };
  return (
    <TapGestureHandler onActivated={onSingleTap}>
      <View style={styles.container}>
        <Text style={styles.text}>Toque na tela </Text>
        <Text style={styles.text}>Contagem de toques: {count}</Text>
      </View>
    </TapGestureHandler>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
});
