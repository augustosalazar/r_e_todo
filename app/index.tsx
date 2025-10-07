import React, { useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  Appbar,
  Button,
  FAB,
  Modal,
  Portal,
  Surface,
  TextInput,
  useTheme
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

  const theme = useTheme();

  const renderItem = ({ item }: ListRenderItemInfo<TodoItem>) => {
    const renderRightActions = () => (
      <Surface style={styles.rightAction}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </Surface>
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
        <Surface style={styles.item}>
          <Text>{item.name}</Text>
          <Button
            mode="contained-tonal"
            onPress={() => editItem(item)}
            style={styles.optionButton}
          >
            Edit
          </Button>
        </Surface>
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

  const newEditModal = <Portal>
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
        onSubmitEditing={saveItem} />
      <Surface
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
      </Surface>
    </Modal>
  </Portal>;


  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Todo List" />
      </Appbar.Header>
      <Surface style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 4 }}
        />
        <FAB style={styles.fab}
          theme={{ colors: { accent: theme.colors.primary } }}
          icon="plus" color="white" onPress={addItem} />
      </Surface>
      {newEditModal}
    </Surface>
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
  },
  optionButton: {
    marginVertical: 5
  },
  bottomSheetStyle: {
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  input: {
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