import { AddPostModal } from "@/components/AddPostModal";
import { BaseModal } from "@/components/BaseModal";
import { EditPostModal } from "@/components/EditPostModal";
import { Text, View } from "@/components/Themed";
import { usePost } from "@/data/Post";
import { EditPostRequest } from "@/model/edit-post.request";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Index() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postSelected, setPostSelected] = useState<EditPostRequest[]>([]);

  const { getAllPosts, post } = usePost();

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleCreatePost = () => {
    setShowAddModal(false);
  };

  const handleEditPost = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    console.log(postSelected.id);
  }, [postSelected]);

  return (
    <View>
      <ScrollView>
        <AddPostModal
          visible={showAddModal}
          onRequestClose={() => setShowAddModal(false)}
          onSubmit={handleCreatePost}
        />

        <EditPostModal
          postId={postSelected.id}
          visible={showEditModal}
          onRequestClose={() => setShowEditModal(false)}
          onSubmit={handleEditPost}
        />
        <View lightColor="#F2F4F7" style={styles.container}>
          {post.map((item, index) => (
            <TouchableOpacity activeOpacity={0.7} style={styles.cardContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.body}</Text>
              <View style={styles.cardOptionContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.cardOptionButton}
                  onPress={() => {
                    setShowEditModal(true);
                    setPostSelected(item);
                  }}
                >
                  <MaterialIcons name="edit" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.cardOptionButton}
                >
                  <MaterialIcons name="delete" size={18} color={"#d42626"} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 18,
    gap: 16,
  },
  cardContainer: {
    width: "100%",
    padding: 16,
    gap: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    fontWeight: "normal",
  },
  addButton: {
    backgroundColor: "#007AFF",
    position: "absolute",
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    bottom: 24,
    right: 24,
    elevation: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 28,
  },
  input: {
    padding: 12,
    borderRadius: 12,
    borderColor: "#c3c3c3",
    borderWidth: 1,
    width: "100%",
  },
  textArea: {
    padding: 12,
    borderRadius: 12,
    borderColor: "#c3c3c3",
    borderWidth: 1,
    width: "100%",
    height: 100,
    textAlignVertical: "top",
  },
  modalContainer: {
    gap: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardOptionContainer: {
    flexDirection: "row",
    gap: 4,
    alignSelf: "flex-end",
  },
  cardOptionButton: {
    borderRadius: 4,
    alignSelf: "center",
    backgroundColor: "#e3e3e3",
    padding: 4,
  },
});
