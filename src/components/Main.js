import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";

export default function Main() {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Bem-Vindo</Text>

      <Image
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={styles.image}
      />

      <Text style={styles.description}>
        Este é um exemplo de layout usando EXPO Native.
      </Text>

      <Button title="Clique Aqui" onPress={() => alert("Botão Pressionado")} />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});
