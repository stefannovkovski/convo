import { api } from "@/services/Api";
import { CreatePostDto } from "@/types/post/CreatePostDto";
import { PostResponseDto } from "@/types/post/PostResponseDto";
import { useCallback, useEffect, useState } from "react";

const initialState = {
    posts: [] as PostResponseDto[],
    loading: true,
    error: null as string | null,
}

export default function usePosts(username?: string){
    const [state, setState] = useState(initialState);

    const url = username
      ? `/users/${username}`
      : '/posts/feed';
      
    const fetchPosts = useCallback(() => {
        setState(initialState);
        api.get<PostResponseDto[]>(url)
        .then((response) => {
            setState({
                posts: response.data,
                loading: false,
                error: null,
            })
        })
        .catch((error) => {
        setState({
          posts: [],
          loading: false,
          error: error.response?.data?.message || "Failed to fetch posts",
        });        
    })
    }, []);

    const onCreate = useCallback((data: CreatePostDto) => {
        api
        .post<PostResponseDto>("/posts", data)
        .then(() => {
            console.log("Successfully created a new post.");
            fetchPosts();
        })
        .catch((error) => {
            console.log(error);
            setState((prevState) => ({
            ...prevState,
            error: error.response?.data?.message || "Failed to create post",
            }));
        });
    }, [fetchPosts]);

    const onDelete = useCallback((postId: number) => {
        api
        .delete(`/posts/${postId}`)
        .then(() => {
            console.log(`Successfully deleted the post with ID ${postId}.`);
            fetchPosts();
        })
        .catch((error) => {
            console.log(error);
            setState((prevState) => ({
            ...prevState,
            error: error.response?.data?.message || "Failed to delete post",
            }));
        });
    }, [fetchPosts]);

    const onEdit = useCallback((postId: number, data: Partial<CreatePostDto>) => {
        api
        .patch<PostResponseDto>(`/posts/${postId}`, data)
        .then(() => {
            console.log(`Successfully edited the post with ID ${postId}.`);
            fetchPosts();
        })
        .catch((error) => {
            console.log(error);
            setState((prevState) => ({
            ...prevState,
            error: error.response?.data?.message || "Failed to update post",
            }));
        });
    }, [fetchPosts]);

    const onToggleLike = useCallback((postId: number) => {
    api
        .post<{ postId: number; isLiked: boolean; likeCount: number }>(
        `/posts/${postId}/like`
        )
        .then((response) => {
        const { postId, isLiked, likeCount } = response.data;

        setState((prevState) => ({
            ...prevState,
            posts: prevState.posts.map((p) =>
            p.id === postId
                ? {
                    ...p,
                    isLikedByMe: isLiked,
                    counts: {
                    ...p.counts,
                    likes: likeCount,
                    },
                }
                : p
            ),
        }));
        })
        .catch((error) => {
        console.log(error);
        setState((prevState) => ({
            ...prevState,
            error: error.response?.data?.message || "Failed to toggle like",
        }));
        });
    }, []);

    const onToggleRetweet = useCallback((postId: number) => {
    api
        .post<{ postId: number; isRetweeted: boolean; retweetCount: number }>(
        `/posts/${postId}/retweet`
        )
        .then((response) => {
        const { postId, isRetweeted, retweetCount } = response.data;

        setState((prevState) => ({
            ...prevState,
            posts: prevState.posts.map((p) =>
            p.id === postId
                ? {
                    ...p,
                    isRetweetedByMe: isRetweeted,
                    counts: {
                    ...p.counts,
                    retweets: retweetCount,
                    },
                }
                : p
            ),
        }));
        })
        .catch((error) => {
        console.log(error);
        setState((prevState) => ({
            ...prevState,
            error: error.response?.data?.message || "Failed to toggle retweet",
        }));
        });
    }, []);

    const clearError = useCallback(() => {
        setState((prevState) => ({
        ...prevState,
        error: null,
        }));
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        ...state,
        fetchPosts,
        onCreate,
        onEdit,
        onDelete,
        onToggleLike,
        onToggleRetweet,
        clearError,
    };
};
