import { useEffect, useState } from 'react';
import { api } from '@/services/Api';

interface TrendingHashtag {
    tag: string;
    count: number;
}

export function useTrending() {
    const [trending, setTrending] = useState<TrendingHashtag[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTrending = () => {
        api.get('/posts/trending')
            .then(res => setTrending(res.data))
            .catch(err => console.error('Failed to fetch trending:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTrending();

        window.addEventListener('post-created', fetchTrending);
        return () => window.removeEventListener('post-created', fetchTrending);
    }, []);

    return { trending, loading };
}