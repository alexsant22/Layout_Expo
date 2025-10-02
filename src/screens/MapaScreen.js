import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";

export default function MapaScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const mapRef = useRef(null);

  // Área delimitada (um polígono retangular em torno da localização inicial)
  const [boundedArea, setBoundedArea] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permissão para acessar a localização foi negada");
          setLoading(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        // Definir área delimitada (500m ao redor da localização)
        const bounds = calculateBoundedArea(loc.coords, 0.005); // ~500m
        setBoundedArea(bounds);
      } catch (error) {
        setErrorMsg("Erro ao obter localização: " + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Calcular área delimitada
  const calculateBoundedArea = (center, delta) => {
    return [
      {
        latitude: center.latitude - delta,
        longitude: center.longitude - delta,
      },
      {
        latitude: center.latitude - delta,
        longitude: center.longitude + delta,
      },
      {
        latitude: center.latitude + delta,
        longitude: center.longitude + delta,
      },
      {
        latitude: center.latitude + delta,
        longitude: center.longitude - delta,
      },
    ];
  };

  // Verificar se o usuário está dentro da área delimitada
  const isInsideBoundedArea = (coord) => {
    if (!boundedArea) return true;

    const { latitude, longitude } = coord;
    const [nw, ne, se, sw] = boundedArea;

    return (
      latitude >= nw.latitude &&
      latitude <= se.latitude &&
      longitude >= nw.longitude &&
      longitude <= ne.longitude
    );
  };

  // Adicionar marcador no mapa
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    // Verificar se está dentro da área delimitada
    if (!isInsideBoundedArea(coordinate)) {
      setAlertMessage(
        "Você não pode adicionar marcadores fora da área delimitada!"
      );
      setShowAlert(true);
      return;
    }

    const newMarker = {
      id: Date.now().toString(),
      coordinate,
      title: `Marcador ${markers.length + 1}`,
    };

    setMarkers([...markers, newMarker]);
  };

  // Monitorar movimento do usuário
  const handleUserLocationChange = (event) => {
    if (event.nativeEvent.coordinate) {
      const userCoord = event.nativeEvent.coordinate;

      // Verificar se o usuário saiu da área delimitada
      if (!isInsideBoundedArea(userCoord)) {
        setAlertMessage("⚠️ Alerta! Você saiu da área delimitada!");
        setShowAlert(true);
      }
    }
  };

  // Limpar todos os marcadores
  const clearMarkers = () => {
    setMarkers([]);
    Alert.alert("Sucesso", "Todos os marcadores foram removidos!");
  };

  // Centralizar no usuário
  const centerOnUser = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {errorMsg}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Buscando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título do App */}
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Explorador de Mapas</Text>
        <Text style={styles.subtitle}>
          {markers.length} marcador{markers.length !== 1 ? "es" : ""} adicionado
          {markers.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={handleMapPress}
        onUserLocationChange={handleUserLocationChange}
        followsUserLocation={true}
      >
        {/* Área delimitada */}
        {boundedArea && (
          <Polygon
            coordinates={boundedArea}
            strokeColor="rgba(255, 0, 0, 0.7)"
            fillColor="rgba(255, 0, 0, 0.1)"
            strokeWidth={2}
          />
        )}

        {/* Marcadores do usuário */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            pinColor="blue"
          />
        ))}
      </MapView>

      {/* Botões de ação */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={centerOnUser}>
          <Text style={styles.buttonText}>📍 Centralizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={clearMarkers}>
          <Text style={styles.buttonText}>🗑️ Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Instruções */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          👆 Toque no mapa para adicionar marcadores
        </Text>
        <Text style={styles.instructionText}>
          🚨 Alerta ao sair da área vermelha
        </Text>
      </View>

      {/* Modal de Alerta */}
      <Modal
        visible={showAlert}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Alerta</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowAlert(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#2196F3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginTop: 5,
    opacity: 0.8,
  },
  map: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  actionButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  instructions: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  instructionText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  alertButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
