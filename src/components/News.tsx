'use client'

import { useEffect, useState } from "react";
import { fetchNews, Article } from "../app/utils/fetchNews";


export default function News() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const getNews = async () => {
          const fetchedArticles = await fetchNews();
          setArticles(fetchedArticles);
          setLoading(false);
        };
    
        getNews();
      }, []);
    
      const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? articles.length - 1 : prevIndex - 1
        );
      };
    
      const handleNext = () => {
        setCurrentIndex((prevIndex) => 
          prevIndex === articles.length - 1 ? 0 : prevIndex + 1
        );
      };
    
      if (articles.length === 0) {
        return (
          <div className="mx-auto w-full h-fit bg-white p-4">
            <p className="text-center text-gray-600">Loading news...</p>
          </div>
        );
      }
    
      const article = articles[currentIndex];
    
      return (
        <div className="mx-auto w-full max-w-screen-xl h-fit flex flex-col items-center">    
          <div className="relative w-full h-80 overflow-hidden rounded shadow items-center group">
            <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full h-full relative"
                >

                {/* Background image */}
                <img 
                    src={article.urlToImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover object-top"
                    style={{ height: 'auto', maxHeight: '600px', transform: 'translateY(-10%)' }}
                />

                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 to-transparent"/>

                {/* Text overlay */}
                <div className="absolute w-full h-full inset-x-0 bottom-0 flex flex-col justify-end p-4">
                    <h3 className="text-white text-lg font-semibold mb-1">{article.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{article.source.name}</p>
                </div>

            </a>
    
            {/* Navigation Arrows */}
            <div className="absolute inset-y-1/2 left-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handlePrev} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 ml-2"
              >
                &#8592;
              </button>
            </div>
    
            <div className="absolute inset-y-1/2 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleNext} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 mr-2"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      );
    }