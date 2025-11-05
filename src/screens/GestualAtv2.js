import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { RotationGestureHandler } from "react-native-gesture-handler";
export default function App() {
  const [rotate] = useState(new Animated.Value(0));
  const onRotateEvent = Animated.event(
    [{ nativeEvent: { rotation: rotate } }],
    { useNativeDriver: true }
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gire o quadrado com dois dedos </Text>
      <RotationGestureHandler onGestureEvent={onRotateEvent}>
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                {
                  rotate: rotate.interpolate({
                    inputRange: [-Math.PI, Math.PI],
                    outputRange: ["-180rad", "180rad"],
                  }),
                },
              ],
            },
          ]}
        />
      </RotationGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "#32CD32",
    borderRadius: 12,
  },
});
