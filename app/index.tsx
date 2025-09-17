import React, { useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  Appbar,
  Button,
  FAB,
  Modal,
  Portal,
  TextInput
} from "react-native-paper";

type TodoItem = {
  id: number;
  name: string;
};

export default function Index() {
const [visible, setVisible] = React.useState<boolean>(false);
  const [data, setData] = useState<TodoItem[]>([{ id: 1, name: "Item 1" }]);
  const [currentItem, setCurrentItem] = useState<TodoItem | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const renderItem = ({ item }: ListRenderItemInfo<TodoItem>) => {
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    );

    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={80}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            deleteItem(item.id);
          }
        }}
      >
        <View style={styles.item}>
          <Text>{item.name}</Text>
          <Button
            mode="contained-tonal"
            onPress={() => editItem(item)}
            style={styles.optionButton}
          >
            Edit
          </Button>
        </View>
      </Swipeable>
    );
  };
  const addItem = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const saveItem = () => {
    if (currentItem) {
      // Edit existing item
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? { ...item, name: inputValue } : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: data.length + 1,
        name: inputValue
      };
      setData((prevData) => [...prevData, newItem]);
    }
    setVisible(false);
  };

  const editItem = (item: TodoItem) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  const deleteItem = (id: number) => {
    console.log("Delete item with id:", id);
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Todo List" />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 4 }}
        />
        <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.bottomSheetStyle}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter TODO item"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={saveItem}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button
              mode="outlined"
              onPress={saveItem}
              style={styles.optionButton}
            >
              Save
            </Button>

            <Button
              mode="outlined"
              onPress={() => setVisible(false)}
              style={styles.optionButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  },
  optionButton: {
    marginVertical: 5
  },
  bottomSheetStyle: {
    backgroundColor: "white",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10
  },
  rightAction: {
    width: 80, // must match rightThreshold
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 16
  },
  deleteText: {
    color: "white",
    fontWeight: "bold"
  }
});