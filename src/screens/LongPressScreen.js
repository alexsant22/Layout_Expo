import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";

export default function LongPressScreen() {
  const [boxColor, setBoxColor] = useState("#FF6347"); // vermelho inicial
  const [longPressCount, setLongPressCount] = useState(0);
  const scale = useRef(new Animated.Value(1)).current; // escala inicial

  const minDuration = 1000; // 1 segundo

  const animateScale = (toValue) => {
    Animated.timing(scale, {
      toValue,
      duration: 200, // duração da animação
      useNativeDriver: true,
    }).start();
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Quando começa o toque longo
      setBoxColor("#32CD32"); // verde
      animateScale(1.5); // aumenta suavemente
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      // Quando solta
      setBoxColor("#FF6347"); // volta ao vermelho
      animateScale(1); // retorna ao tamanho original
      setLongPressCount(longPressCount + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Toques longos: {longPressCount}</Text>
      <Text style={styles.title}>Segure o quadrado</Text>
      <LongPressGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        minDurationMs={minDuration}
      >
        <Animated.View
          style={[
            styles.box,
            {
              backgroundColor: boxColor,
              transform: [{ scale }], // aplica a escala animada
            },
          ]}
        >
          <Text style={styles.boxText}>Segure-me</Text>
        </Animated.View>
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
  counter: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  title: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  box: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  boxText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
