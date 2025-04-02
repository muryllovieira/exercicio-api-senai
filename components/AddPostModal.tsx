import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BaseModal } from "./BaseModal";
import { useState } from "react";
import { CreatePostRequest } from "@/model/create-post.request";
import { usePost } from "@/data/Post";

interface AddPostModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: () => void;
}

export const AddPostModal = ({
  visible,
  onRequestClose,
}: AddPostModalProps) => {
  const [postSelected, setPostSelected] = useState<CreatePostRequest[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { createPost, createPostRequestStatus } = usePost();

  const handlerCreate = () => {
    createPost({ title, body, userId: 1 });
    console.log(createPostRequestStatus);
  };

  if (!visible) return null;

  return (
    <BaseModal visible>
      <View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>Adicionar Post</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onRequestClose}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Título"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Descrição"
            style={styles.textArea}
            multiline
            value={body}
            onChangeText={setBody}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={() => {
            onRequestClose(), handlerCreate();
          }}
        >
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    gap: 16,
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
});
