import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);

  // Solicitar permissões ao iniciar o app
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada");
        return;
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg("Erro ao obter localização: " + error.message);
    }
  };

  const startTracking = async () => {
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada");
        return;
      }

      // Configurar as opções de rastreamento
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Atualizar a cada 5 segundos
          distanceInterval: 10, // Atualizar a cada 10 metros
        },
        (newLocation) => {
          setLocation(newLocation);
          console.log("Nova localização:", newLocation);
        }
      );

      setLocationSubscription(subscription);
      setIsTracking(true);

      // Obter a localização atual imediatamente
      getCurrentLocation();
    } catch (error) {
      setErrorMsg("Erro ao iniciar rastreamento: " + error.message);
    }
  };

  const stopTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    setIsTracking(false);
  };

  // Limpar subscription quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  const getStatusText = () => {
    if (errorMsg) {
      return errorMsg;
    }

    if (isTracking && location) {
      return `Rastreando...\nLatitude: ${location.coords.latitude.toFixed(
        6
      )}\nLongitude: ${location.coords.longitude.toFixed(6)}`;
    }

    if (isTracking) {
      return "Buscando localização...";
    }

    if (location) {
      return `Latitude: ${location.coords.latitude.toFixed(
        6
      )}\nLongitude: ${location.coords.longitude.toFixed(6)}`;
    }

    return "Buscando localização...";
  };

  const getStatusColor = () => {
    if (errorMsg) return "#FF6B6B";
    if (isTracking) return "#4ECDC4";
    if (location) return "#51CF66";
    return "#FFD93D";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastreamento de Localização</Text>

      <View
        style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}
      >
        <Text style={styles.statusText}>
          Status:{" "}
          {isTracking
            ? "Rastreando ativamente"
            : location
            ? "Localização obtida"
            : errorMsg
            ? "Erro"
            : "Preparado"}
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationTitle}>Localização:</Text>
        <Text style={styles.locationText}>{getStatusText()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <View style={styles.button}>
            <Button
              title="Iniciar Rastreamento"
              onPress={startTracking}
              color="#4ECDC4"
            />
          </View>
        ) : (
          <View style={styles.button}>
            <Button
              title="Parar Rastreamento"
              onPress={stopTracking}
              color="#FF6B6B"
            />
          </View>
        )}

        <View style={styles.button}>
          <Button
            title="Atualizar Localização"
            onPress={getCurrentLocation}
            disabled={isTracking}
            color="#6C5CE7"
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {isTracking
            ? "📍 Rastreamento ativo - atualizando a cada 5 segundos ou 10 metros"
            : "👆 Toque em 'Iniciar Rastreamento' para monitoramento contínuo"}
        </Text>

        {location && (
          <Text style={styles.detailsText}>
            Precisão: ±{location.coords.accuracy?.toFixed(1) || "N/A"} metros
            {location.coords.altitude &&
              `\nAltitude: ${location.coords.altitude.toFixed(1)} metros`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#2D3436",
    textAlign: "center",
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3436",
    textAlign: "center",
  },
  locationContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D3436",
  },
  locationText: {
    fontSize: 16,
    color: "#636E72",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 30,
  },
  button: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  infoText: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 12,
    color: "#636E72",
    textAlign: "center",
    fontStyle: "italic",
  },
});
