import { CreatePostRequest } from "@/model/create-post.request";
import { GetPostsResponse } from "@/model/get-posts.response";
import { RequestStatus } from "@/model/request.status";
import { api } from "@/service/axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

interface PostContextProps {
  getAllPosts: () => void;
  createPost: (data: CreatePostRequest) => void;
  createPostRequestStatus: RequestStatus;
  post: GetPostsResponse[];
  getAllPostsRequestStatus: RequestStatus;
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

  const [post, setPost] = useState<GetPostsResponse[]>([]);

  const [createPostRequest, setCreatePostRequest] = useState<CreatePostRequest>(
    {} as CreatePostRequest
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
      Alert.alert("criou");
    } catch (error) {
      console.error(error);
      setCreatePostRequestStatus({ status: "failed" });
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
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
