import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, PanResponder } from "react-native";

const { width } = Dimensions.get("window");

const RotationScreen = () => {
  const [angle, setAngle] = useState(0);
  const [color, setColor] = useState("green");

  // Criar um PanResponder para simular rotação com um dedo (para demonstração)
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { moveX, moveY } = gestureState;
      const centerX = width / 2;
      const centerY = 200; // Posição Y aproximada do centro do quadrado

      // Calcular o ângulo baseado na posição do toque
      const deltaX = moveX - centerX;
      const deltaY = moveY - centerY;
      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // Limitar a rotação a ±180 graus
      if (newAngle > 180) newAngle = 180;
      if (newAngle < -180) newAngle = -180;

      setAngle(newAngle);

      // Mudar cor ao atingir 90°
      if (Math.abs(newAngle) >= 90) {
        setColor("blue");
      } else {
        setColor("green");
      }
    },
  });

  return (
    <View style={styles.container}>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.square,
          {
            transform: [{ rotate: `${angle}deg` }],
            backgroundColor: color,
          },
        ]}
      />
      <Text style={styles.angleText}>Ângulo: {angle.toFixed(2)}°</Text>
      <Text style={styles.instructionText}>
        Arraste o dedo ao redor do quadrado para rotacioná-lo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  square: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 20,
  },
  angleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  instructionText: {
    fontSize: 16,
    marginTop: 10,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default RotationScreen;
