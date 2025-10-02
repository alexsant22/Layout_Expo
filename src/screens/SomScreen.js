import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";

export default function SomScreen() {
  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState("Parado"); // "Parado", "Tocando", "Pausado"

  async function loadSound() {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../../assets/audio.mp3")
      );
      setSound(newSound);
    } catch (error) {
      console.error("Erro ao carregar o áudio:", error);
    }
  }

  async function playSound() {
    if (!sound) {
      await loadSound();
    }

    try {
      await sound.playAsync();
      setStatus("Tocando");
    } catch (error) {
      console.error("Erro ao reproduzir o áudio:", error);
    }
  }

  async function pauseSound() {
    if (sound) {
      try {
        await sound.pauseAsync();
        setStatus("Pausado");
      } catch (error) {
        console.error("Erro ao pausar o áudio:", error);
      }
    }
  }

  async function stopSound() {
    if (sound) {
      try {
        await sound.stopAsync();
        setStatus("Parado");
      } catch (error) {
        console.error("Erro ao parar o áudio:", error);
      }
    }
  }

  // Carregar o som quando o componente montar
  useEffect(() => {
    loadSound();
  }, []);

  // Descarregar o som quando o componente desmontar ou quando sair do app
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reprodutor de Áudio</Text>

      <Text style={styles.status}>Status: {status}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Play"
          onPress={playSound}
          disabled={status === "Tocando"}
        />

        <Button
          title="Pause"
          onPress={pauseSound}
          disabled={status !== "Tocando"}
        />

        <Button
          title="Stop"
          onPress={stopSound}
          disabled={status === "Parado"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
  },
  status: {
    fontSize: 18,
    marginBottom: 30,
    color: "#333",
  },
  buttonContainer: {
    gap: 10,
    width: "80%",
  },
});
