import { api } from "@/services/Api";
import { SearchUser } from "@/types/user/SearchUser";
import { useState, useCallback } from "react";

const initialState = {
  users: [] as SearchUser[],
  loading: false,
  error: null as string | null,
};

export default function useUserSearch() {
  const [state, setState] = useState(initialState);

  const searchUsers = useCallback((query: string) => {
    if (!query.trim()) {
      setState(initialState);
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    api
      .get<SearchUser[]>(`/users/search?q=${encodeURIComponent(query)}`)
      .then((response) => {
        setState({
          users: response.data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        setState({
          users: [],
          loading: false,
          error: error.response?.data?.message || "Failed to search users",
        });
      });
  }, []);

  const toggleFollow = useCallback((username: string) => {
    api
      .post<{ isFollowing: boolean }>(`/users/${username}/follow`)
      .then((response) => {
        const { isFollowing } = response.data;
        
        setState((prevState) => ({
          ...prevState,
          users: prevState.users.map((user) =>
            user.username === username
              ? {
                  ...user,
                  isFollowedByMe: isFollowing,
                  followersCount: isFollowing 
                    ? user.followersCount + 1 
                    : user.followersCount - 1,
                }
              : user
          ),
        }));
      })
      .catch((error) => {
        console.log(error);
        setState((prevState) => ({
          ...prevState,
          error: error.response?.data?.message || "Failed to toggle follow",
        }));
      });
  }, []);

  const clearError = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      error: null,
    }));
  }, []);

  const clearResults = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    searchUsers,
    toggleFollow,
    clearError,
    clearResults,
  };
}