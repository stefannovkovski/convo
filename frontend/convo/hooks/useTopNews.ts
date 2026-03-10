import { useState, useEffect } from 'react';

interface NewsArticle {
    title: string;
    source: { name: string };
    url: string;
    urlToImage: string;
    publishedAt: string;
}

export function useTopNews(category = 'technology') {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(
                    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=3&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
                );
                const data = await res.json();
                setArticles(data.articles || []);
            } catch (err) {
                console.error('Failed to fetch news:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [category]);

    return { articles, loading };
}