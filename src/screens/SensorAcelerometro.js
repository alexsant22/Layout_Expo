import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function SensorAcelerometro() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState([]);

  // Configuração do limite para detecção de sacudidas
  const SHAKE_THRESHOLD = 1.5;

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        if (!isPaused) {
          setData(accelerometerData);

          // Adicionar ao histórico
          setHistory((prevHistory) => {
            const newHistory = [
              {
                x: accelerometerData.x.toFixed(2),
                y: accelerometerData.y.toFixed(2),
                z: accelerometerData.z.toFixed(2),
                timestamp: new Date().toLocaleTimeString(),
              },
              ...prevHistory.slice(0, 9), // Manter apenas os últimos 10
            ];
            return newHistory;
          });

          // Detectar sacudidas
          detectShake(accelerometerData);
        }
      })
    );
    Accelerometer.setUpdateInterval(500);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const togglePause = () => {
    if (isPaused) {
      _subscribe();
    } else {
      _unsubscribe();
    }
    setIsPaused(!isPaused);
  };

  const detectShake = (accelerometerData) => {
    const { x, y, z } = accelerometerData;
    const acceleration = Math.sqrt(x * x + y * y + z * z);

    if (acceleration > SHAKE_THRESHOLD) {
      Alert.alert(
        "⚠️ Movimento Brusco Detectado!",
        `Aceleração: ${acceleration.toFixed(2)}g\n` +
          `Valores: X:${x.toFixed(2)} Y:${y.toFixed(2)} Z:${z.toFixed(2)}`,
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    // Reiniciar a subscription quando pausar/retomar
    if (isPaused) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  }, [isPaused]);

  let { x, y, z } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leitura do Acelerômetro</Text>

      {/* Status e Botão de Pausa */}
      <View style={styles.controlPanel}>
        <Text style={[styles.status, isPaused ? styles.paused : styles.active]}>
          Status: {isPaused ? "PAUSADO" : "ATIVO"}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            isPaused ? styles.resumeButton : styles.pauseButton,
          ]}
          onPress={togglePause}
        >
          <Text style={styles.buttonText}>
            {isPaused ? "▶ RETOMAR" : "⏸ PAUSAR"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dados Atuais */}
      <View style={styles.dataBox}>
        <Text style={styles.sectionTitle}>Dados Atuais</Text>
        <Text style={styles.text}>Eixo x: {x.toFixed(2)}</Text>
        <Text style={styles.text}>Eixo y: {y.toFixed(2)}</Text>
        <Text style={styles.text}>Eixo z: {z.toFixed(2)}</Text>

        {/* Indicador de Sacudida */}
        <View style={styles.shakeIndicator}>
          <Text style={styles.shakeText}>
            Limite de sacudida: {SHAKE_THRESHOLD}g
          </Text>
        </View>
      </View>

      {/* Histórico */}
      <View style={styles.historyBox}>
        <Text style={styles.sectionTitle}>Histórico (Últimos 10)</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyHistory}>Nenhum dado registrado</Text>
        ) : (
          history.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>
                {item.timestamp} - X:{item.x} Y:{item.y} Z:{item.z}
              </Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.info}>
        {isPaused
          ? "Leitura pausada - pressione RETOMAR para continuar"
          : "Mova o dispositivo para ver as mudanças nos valores do acelerômetro."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  controlPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  active: {
    backgroundColor: "#00ff99",
    color: "#000",
  },
  paused: {
    backgroundColor: "#ff4444",
    color: "#fff",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  pauseButton: {
    backgroundColor: "#ffaa00",
  },
  resumeButton: {
    backgroundColor: "#00aa00",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  dataBox: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  historyBox: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxHeight: 200,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    color: "#00ff99",
    marginVertical: 5,
  },
  shakeIndicator: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  shakeText: {
    fontSize: 14,
    color: "#ffaa00",
    fontWeight: "bold",
  },
  historyItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  historyText: {
    fontSize: 12,
    color: "#cccccc",
  },
  emptyHistory: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  info: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 10,
    textAlign: "center",
  },
});
