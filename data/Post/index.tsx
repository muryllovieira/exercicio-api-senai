import { CreatePostRequest } from "@/model/create-post.request";
import { EditPostRequest } from "@/model/edit-post.request";
import { GetPostsResponse } from "@/model/get-posts.response";
import { RequestStatus } from "@/model/request.status";
import { api } from "@/service/axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

interface PostContextProps {
  getAllPosts: () => void;
  createPost: (data: CreatePostRequest) => void;
  updatePost: (data: EditPostRequest, id: number) => void;
  deletePost: (id: number) => void;

  post: GetPostsResponse[];
  getAllPostsRequestStatus: RequestStatus;
  createPostRequestStatus: RequestStatus;
  updatePostRequestStatus: RequestStatus;
  deletePostRequestStatus: RequestStatus;
}

interface PostProviderProps {
  children: ReactNode;
}

const PostContext = createContext<PostContextProps>({} as PostContextProps);

export const usePost = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }: PostProviderProps) => {
  const [getAllPostsRequestStatus, setGetAllPostsRequestStatus] =
    useState<RequestStatus>({ status: "idle" });

  const [createPostRequestStatus, setCreatePostRequestStatus] =
    useState<RequestStatus>({
      status: "idle",
    });

  const [updatePostRequestStatus, setUpdatePostRequestStatus] =
    useState<RequestStatus>({
      status: "idle",
    });

  const [deletePostRequestStatus, setDeletePostRequestStatus] =
    useState<RequestStatus>({
      status: "idle",
    });

  const [post, setPost] = useState<GetPostsResponse[]>([]);

  const [createPostRequest, setCreatePostRequest] = useState<CreatePostRequest>(
    {} as CreatePostRequest
  );

  const [updatePostRequest, setUpdatePostRequest] = useState<EditPostRequest>(
    {} as EditPostRequest
  );

  const getAllPosts = async () => {
    setGetAllPostsRequestStatus({ status: "pending" });

    try {
      const response = await api.get<GetPostsResponse[]>("/posts");
      setGetAllPostsRequestStatus({ status: "succeeded" });
      setPost(response.data);
    } catch (error) {
      console.error(error);
      setGetAllPostsRequestStatus({ status: "failed" });
    }
  };

  const createPost = async (data: CreatePostRequest) => {
    setCreatePostRequestStatus({ status: "pending" });

    try {
      await api.post<CreatePostRequest>("posts", data);
      setCreatePostRequestStatus({ status: "succeeded" });
    } catch (error) {
      console.error(error);
      setCreatePostRequestStatus({ status: "failed" });
    }
  };

  const updatePost = async (data: EditPostRequest, id: number) => {
    setUpdatePostRequestStatus({ status: "pending" });
    try {
      await api.patch<EditPostRequest>(`posts/${id}`, data);
      setUpdatePostRequestStatus({ status: "succeeded" });
    } catch (error) {
      console.error(error);
      setUpdatePostRequestStatus({ status: "failed" });
    }
  };

  const deletePost = async (id: number) => {
    setDeletePostRequestStatus({ status: "pending" });
    try {
      Alert.alert(
        "Excluir Post",
        "Deseja excluir este post?",
        [
          {
            text: "Sim",
            onPress: async () => {
              try {
                await api.delete(`posts/${id}`);
                setDeletePostRequestStatus({ status: "succeeded" });
                console.log(deletePostRequestStatus);
              } catch (error) {
                setDeletePostRequestStatus({ status: "failed" });
                console.log(deletePostRequestStatus);
              }
            },
          },
          {
            text: "Não",
            onPress: () => {
              setDeletePostRequestStatus({ status: "failed" }),
                console.log(deletePostRequestStatus);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error);
      setDeletePostRequestStatus({ status: "failed" });
    }
  };

  return (
    <PostContext.Provider
      value={{
        getAllPostsRequestStatus,
        post,
        getAllPosts,
        createPost,
        createPostRequestStatus,
        updatePost,
        updatePostRequestStatus,
        deletePost,
        deletePostRequestStatus,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
