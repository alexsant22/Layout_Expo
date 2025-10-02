import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CrudScreen() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Chave para armazenamento
  const STORAGE_KEY = "@crud_items";

  // Carregar dados salvos ao iniciar o app
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setItems(JSON.parse(value));
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  };

  // Salvar dados no AsyncStorage
  const saveData = async (newItems) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  // CREATE - Adicionar novo item
  const addItem = async () => {
    if (text.trim() === "") {
      Alert.alert("Atenção", "Por favor, digite um item.");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    await saveData(newItems);
    setText("");
    Keyboard.dismiss();
  };

  // READ - Preparar para edição (abrir modal)
  const startEdit = (item) => {
    setEditingItem(item);
    setEditText(item.text);
    setModalVisible(true);
  };

  // UPDATE - Atualizar item
  const updateItem = async () => {
    if (editText.trim() === "") {
      Alert.alert("Atenção", "O item não pode estar vazio.");
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            text: editText.trim(),
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setItems(updatedItems);
    await saveData(updatedItems);
    setModalVisible(false);
    setEditingItem(null);
    setEditText("");
    Keyboard.dismiss();
  };

  // DELETE - Remover item
  const deleteItem = async (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este item?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const filteredItems = items.filter((item) => item.id !== id);
            setItems(filteredItems);
            await saveData(filteredItems);
          },
        },
      ]
    );
  };

  // DELETE ALL - Limpar todos os dados
  const clearAllItems = async () => {
    Alert.alert(
      "Confirmar limpeza",
      "Tem certeza que deseja excluir TODOS os itens?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: async () => {
            setItems([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
            setText("");
          },
        },
      ]
    );
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 CRUD Completo</Text>
      <Text style={styles.subtitle}>Create, Read, Update, Delete</Text>

      {/* Formulário de adição */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um novo item..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={addItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>➕ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Contador e botão limpar tudo */}
      <View style={styles.headerActions}>
        <Text style={styles.counter}>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </Text>
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllItems}
          >
            <Text style={styles.clearAllText}>🗑️ Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de itens */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.text}</Text>
              <Text style={styles.itemDate}>
                Criado: {formatDate(item.createdAt)}
                {item.updatedAt && ` • Editado: ${formatDate(item.updatedAt)}`}
              </Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEdit(item)}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭 Nenhum item cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Use o campo acima para adicionar seu primeiro item!
            </Text>
          </View>
        }
        style={styles.list}
      />

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Editar Item</Text>

            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="Digite o novo texto..."
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={updateItem}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  counter: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  clearAllButton: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 8,
  },
  clearAllText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    marginRight: 5,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
