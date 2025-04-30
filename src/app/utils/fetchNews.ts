import axios from 'axios';

export type Article = {
    title: string;
    url: string;
    urlToImage: string;
    source: { name: string };
}

export async function fetchNews(): Promise<Article[]> {
    const apiKey = "91f264aeca8645faacb0d5dc9339c17f";
    const url = "https://newsapi.org/v2/everything";

    try {
        const response = await axios.get(url, {
            params: {
                q: 'Lebron James',
                sortBy: 'publishedAt',
                pageSize: 30,
                language: 'en',
                apiKey: apiKey
            }
        });

        let articles = response.data.articles.filter(
            (article: any) => 
                article?.urlToImage &&
                typeof article?.title === 'string' &&
                article.title.toLowerCase().includes('lebron james')

        );

        return articles.slice(0,5);

    } catch (error: any) {
        console.log('Error fetching news:', error.response ? error.response.data : error.message);
        return [];
    }
}