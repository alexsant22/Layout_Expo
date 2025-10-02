import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";

export default function SomScreen() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playSound() {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../../assets/audio.mp3")
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

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
      <Button
        title={isPlaying ? "Pausar" : "Tocar"}
        onPress={isPlaying ? pauseSound : playSound}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
