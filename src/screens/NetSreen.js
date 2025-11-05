import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Platform, Alert } from "react-native";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";

export default function NetScreen() {
  const [netInfo, setNetInfo] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [wasConnected, setWasConnected] = useState(null);

  useEffect(() => {
    // Pede permissão de localização (necessário para acessar ssid em Android)
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissionGranted(status === "granted");
      } catch (e) {
        setPermissionGranted(false);
      }
    })();

    // Subscreve mudanças de rede
    const unsubscribe = NetInfo.addEventListener((state) => {
      handleNetworkChange(state);
    });

    // pega o estado atual uma vez
    NetInfo.fetch().then((state) => handleNetworkChange(state));

    return () => unsubscribe();
  }, []);

  const handleNetworkChange = (state) => {
    const previousState = netInfo;
    setNetInfo(state);

    // Verifica se houve mudança no estado de conexão
    if (previousState && previousState.isConnected !== state.isConnected) {
      if (!state.isConnected) {
        // Conexão caiu
        Alert.alert(
          "Conexão Perdida",
          "Sua conexão com a internet foi perdida.",
          [{ text: "OK" }]
        );
      }
    }

    // Atualiza estado anterior
    setWasConnected(previousState ? previousState.isConnected : null);

    // Adiciona ao histórico
    addToHistory(state);
  };

  const addToHistory = (state) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    let statusText = "";
    if (state.isConnected) {
      if (state.type === "wifi" && state.details && state.details.ssid) {
        statusText = `conectado ao Wi-Fi ${state.details.ssid}`;
      } else {
        statusText = `conectado via ${state.type}`;
      }
    } else {
      statusText = "desconectado";
    }

    const historyEntry = `${timeString} - ${statusText}`;

    setConnectionHistory((prev) => {
      // Evita duplicar entradas consecutivas iguais
      if (prev.length === 0 || prev[0] !== historyEntry) {
        return [historyEntry, ...prev.slice(0, 9)]; // Mantém apenas os últimos 10
      }
      return prev;
    });
  };

  const refresh = async () => {
    const state = await NetInfo.fetch();
    handleNetworkChange(state);
  };

  const getConnectionTypeText = () => {
    if (!netInfo) return "Carregando...";

    if (!netInfo.isConnected) return "Desconectado";

    switch (netInfo.type) {
      case "wifi":
        return "Wi-Fi";
      case "cellular":
        return "Cellular/Dados móveis";
      case "ethernet":
        return "Ethernet";
      case "bluetooth":
        return "Bluetooth";
      case "vpn":
        return "VPN";
      case "other":
        return "Outro tipo";
      default:
        return netInfo.type;
    }
  };

  const getSSID = () => {
    if (!netInfo || !netInfo.details) return "Indisponível";

    if (netInfo.type === "wifi" && netInfo.details.ssid) {
      return netInfo.details.ssid;
    }

    return "Não aplicável";
  };

  const renderContent = () => {
    if (!netInfo) return <Text>Buscando estado da rede...</Text>;

    return (
      <>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: netInfo.isConnected ? "#4CAF50" : "#F44336" },
            ]}
          />
          <Text style={styles.statusText}>
            Status: {netInfo.isConnected ? "Conectado" : "Desconectado"}
          </Text>
        </View>

        <Text style={styles.line}>
          Tipo de conexão: {getConnectionTypeText()}
        </Text>

        <Text style={styles.line}>SSID: {getSSID()}</Text>

        <Text style={styles.line}>
          Internet alcançável:{" "}
          {netInfo.isInternetReachable === null
            ? "—"
            : netInfo.isInternetReachable
            ? "Sim"
            : "Não"}
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitor de Conexão Wi-Fi</Text>

      {renderContent()}

      <View style={styles.buttonContainer}>
        <Button title="Atualizar status" onPress={refresh} />
      </View>

      <Text style={styles.historyTitle}>Histórico de Conexões</Text>
      <View style={styles.historyContainer}>
        {connectionHistory.length > 0 ? (
          connectionHistory.map((entry, index) => (
            <Text key={index} style={styles.historyEntry}>
              {entry}
            </Text>
          ))
        ) : (
          <Text style={styles.noHistory}>Nenhum registro no histórico</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.small}>
          Permissão de localização:{" "}
          {permissionGranted ? "Concedida" : "Não concedida"}
        </Text>

        <Text style={styles.note}>
          Observação: para acessar SSID em Android é necessária permissão de
          localização.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
  },
  line: {
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  historyContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyEntry: {
    fontSize: 14,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  noHistory: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  small: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  note: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
});
