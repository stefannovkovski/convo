import { api } from "@/services/Api";
import { CreatePostDto } from "@/types/post/CreatePostDto";
import { PostDetailsResponseDto } from "@/types/post/PostDetailsResponseDto";
import { PostResponseDto } from "@/types/post/PostResponseDto";
import { useCallback, useEffect, useState } from "react";

const initialState = {
    posts: [] as PostResponseDto[] | PostDetailsResponseDto[],
    loading: true,
    error: null as string | null,
}

export default function usePosts(params?: {username?: string; postId?: number}){
    const [state, setState] = useState(initialState);
    type PostDto = PostResponseDto | PostDetailsResponseDto;

    const url = params?.postId
    ? `/posts/${params.postId}`
    : params?.username
        ? `/users/${params.username}`
        : '/posts/feed';
        
    const fetchPosts = useCallback(() => {
            setState(initialState);
            api.get<PostDto | PostDto[]>(url)
            .then((response) => {
                const posts = Array.isArray(response.data)
                    ? response.data
                    : [response.data];
                setState({
                    posts,
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

    const onCreate = useCallback((data: FormData | { content: string; imageUrl?: string } ) => {
        if (data instanceof FormData) {
            api.post<PostResponseDto>("/posts", data, {
                headers: { 'Content-Type': 'multipart/form-data'},
            })
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
        } else {
            api.post<PostResponseDto>('/posts', data)
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
        }


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
        }
        )
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

        const onComment = useCallback(
        (postId: number, content: string) => {
            api
            .post<{ commentCount: number }>(`/posts/${postId}/comments`, {
                content,
            })
            .then((response) => {
                fetchPosts();
            })
            .catch((error) => {
                console.log(error);
                setState((prevState) => ({
                ...prevState,
                error:
                    error.response?.data?.message ||
                    "Failed to create comment",
                }));
            });
        },
        [fetchPosts]
        );

        const onDeleteComment = useCallback(
        (commentId: number, postId: number) => {
            api
            .delete(`/posts/comments/${commentId}`)
            .then(() => {
                setState((prevState) => ({
                ...prevState,
                posts: prevState.posts.map((p) =>
                    p.id === postId
                    ? {
                        ...p,
                        counts: {
                            ...p.counts,
                            comments: p.counts.comments - 1,
                        },
                        ...('comments' in p ? {
                            comments: p.comments.filter((c: any) => c.id !== commentId)
                        } : {})
                        }
                    : p
                ),
                }));
            })
            .catch((error) => {
                setState((prevState) => ({
                ...prevState,
                error: error.response?.data?.message || "Failed to delete comment",
                }));
            });
        },
        []
        );


    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        ...state,
        fetchPosts,
        onCreate,
        onComment,
        onDeleteComment,
        onEdit,
        onDelete,
        onToggleLike,
        onToggleRetweet,
        clearError,
    };
};
