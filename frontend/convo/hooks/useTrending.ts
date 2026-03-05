import { useEffect, useState } from "react";
import { api } from "@/services/Api";

interface TrendingHashtag {
    tag: string;
    count: number;
}

export function useTrending() {
    const [trending, setTrending] = useState<TrendingHashtag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/posts/trending')
        .then(res => setTrending(res.data))
        .catch(err => console.error('Failed to fetch trending:', err))
        .finally(() => setLoading(false));
    
    }, []);
    
    return { trending, loading};
}