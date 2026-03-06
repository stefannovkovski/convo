import { useEffect, useState } from "react";
import { User } from "@/types/user/User";
import { api } from "@/services/Api";

export function useSuggestedUser() {
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSuggestedUsers = () => {
        api.get('/users/suggested')
            .then(res => setSuggestedUsers(res.data))
            .catch(err => console.error('Failed to fetch suggested users:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSuggestedUsers();
    }, []);

    return { suggestedUsers, loading, refetch: fetchSuggestedUsers };
}