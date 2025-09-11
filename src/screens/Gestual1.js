import React from "react";
import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";

export default function Gestual1Screen() {
  // Cria um valor animado 2D(x e y) que vai controlar o quadrado
  const pan = useRef(new Animated.ValueXY()).current;

  // Configura o PanResponder(responsável por detectar movimento)
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false
    }),
    onPanResponderRelease: () => {},
  }).current;

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a971fdff",
    alignItems: "center",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#4848feff",
    borderRadius: 10,
  },
});
