import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen() {
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    // Solicitar permissão da mídia
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(status === "granted");
    })();
  }, []);

  if (!permission) {
    // A permissão da câmera ainda está carregando
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // A permissão da câmera não foi concedida
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos de sua permissão para usar a câmera
        </Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        setPhoto(photoData.uri);

        // Salvar na galeria se tiver permissão
        if (mediaPermission) {
          await MediaLibrary.saveToLibraryAsync(photoData.uri);
          Alert.alert("Sucesso", "Foto salva na galeria!");
        } else {
          Alert.alert(
            "Aviso",
            "Foto tirada, mas não foi salva na galeria por falta de permissão"
          );
        }
      } catch (error) {
        console.error("Erro ao tirar foto:", error);
        Alert.alert("Erro", "Não foi possível tirar a foto");
      }
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Virar Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            />
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.buttonRow}>
            <Button title="Tirar outra foto" onPress={() => setPhoto(null)} />
            <Button
              title="Manter foto"
              onPress={() => {
                Alert.alert(
                  "Foto salva",
                  "Sua foto foi capturada com sucesso!"
                );
                setPhoto(null);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#ccc",
    alignSelf: "center",
  },
  flipButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  preview: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
});
