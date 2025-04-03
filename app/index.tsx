import { AddPostModal } from "@/components/AddPostModal";
import { BaseModal } from "@/components/BaseModal";
import { EditPostModal } from "@/components/EditPostModal";
import { Text, View } from "@/components/Themed";
import { usePost } from "@/data/Post";
import { EditPostRequest } from "@/model/edit-post.request";
import { MaterialIcons } from "@expo/vector-icons";
import { DarkTheme, ThemeContext } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

export default function Index() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postSelected, setPostSelected] = useState<EditPostRequest[]>([]);

  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const { getAllPosts, post, deletePost, getAllPostsRequestStatus } = usePost();

  const loadMoreData = () => {
    if (loading || allDataLoaded) return;
    if (postSelected.length === post.length) {
      setAllDataLoaded(true);
      return;
    }

    const nextPage = currentPage + 1;
    const min = currentPage * pageSize;
    const max = nextPage * pageSize;
    const newData = post.slice(min, max);

    if (newData.length === 0) {
      setAllDataLoaded(true);
    } else {
      setPostSelected((prevData) =>
        prevData ? [...prevData, ...newData] : newData
      );
      setCurrentPage(nextPage);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    const initialValue = post.slice(0, pageSize);
    setPostSelected(initialValue);
    setCurrentPage(1);
  }, [post]);

  const handleCreatePost = () => {
    setShowAddModal(false);
  };

  const handleEditPost = () => {
    setShowEditModal(false);
  };

  useEffect(() => {}, [postSelected]);

  const colorScheme = useColorScheme();

  return (
    <View lightColor="#F2F4F7" style={{ padding: 16, flex: 1 }}>
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

      {getAllPostsRequestStatus.status === "pending" ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={post}
          contentContainerStyle={{ rowGap: 8 }}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.cardContainer}>
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
                    onPress={() => {
                      deletePost(item.id);
                    }}
                  >
                    <MaterialIcons name="delete" size={18} color={"#d42626"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

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
  },
  cardContainer: {
    width: "100%",
    padding: 16,
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
