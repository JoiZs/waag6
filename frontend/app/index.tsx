import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import axios from "axios";

const backendUrl = "http://localhost:3001"; // Replace with your backend URL if needed

export default function Index() {
  const [todoList, setTodoList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<null | number>(null);

  // Load TODO list from backend on first render
  useEffect(() => {
    handleRestore();
  }, []);

  // Add a new TODO item
  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    setTodoList([...todoList, inputValue.trim()]);
    setInputValue("");
  };

  // Delete a TODO item
  const handleDelete = (index: number) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  // Edit a TODO item
  const handleEdit = (index: number) => {
    setInputValue(todoList[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const saveEdit = () => {
    const updatedList = [...todoList];
    updatedList[editingIndex!] = inputValue.trim();
    setTodoList(updatedList);
    setInputValue("");
    setIsEditing(false);
    setEditingIndex(null);
  };

  // Save TODO list to the backend
  const handleSave = async () => {
    try {
      await axios.post(`${backendUrl}/save`, todoList);
      alert("TODO list saved successfully!");
    } catch (error) {
      console.error("Error saving TODO list:", error);
      alert("Failed to save TODO list.");
    }
  };

  // Restore TODO list from the backend
  const handleRestore = async () => {
    try {
      const response = await axios.get(`${backendUrl}/load`);
      setTodoList(response.data);
    } catch (error) {
      console.error("Error restoring TODO list:", error);
      alert("Failed to restore TODO list.");
    }
  };

  // Clear TODO list on the backend and locally
  const handleClear = async () => {
    try {
      await axios.get(`${backendUrl}/clear`);
      setTodoList([]);
      alert("TODO list cleared successfully!");
    } catch (error) {
      console.error("Error clearing TODO list:", error);
      alert("Failed to clear TODO list.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Save" onPress={handleSave} />
        <Button title="Restore" onPress={handleRestore} />
        <Button title="Clear" onPress={handleClear} />
      </View>

      <FlatList
        data={todoList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item}</Text>
            <TouchableOpacity
              onPress={() => handleEdit(index)}
              style={styles.editButton}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter a TODO item"
        />
        <Button
          title={isEditing ? "Edit" : "Add"}
          onPress={isEditing ? saveEdit : handleAdd}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  editButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "#ffd700",
    borderRadius: 5,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "#ff6347",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
