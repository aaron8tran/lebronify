import axios from 'axios';

export type Article = {
    title: string;
    url: string;
    urlToImage: string;
    source: { name: string };
}

export async function fetchNews(): Promise<Article[]> {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const url = "https://newsapi.org/v2/everything";
    console.log("API KEY:", apiKey); // or NEXT_PUBLIC_

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