import React, { useState, useEffect } from 'react';

import { HanzCardArticleContainer } from "../common/HanzCardArticleContainer";
import {useTheme} from "../ThemeContext";
import axios from "axios";

interface RssItem {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    "dc:creator"?: string;
    description: string;
}
export function Blog() {
    const [posts, setPosts] = useState<Array<{
        title: string,
        pubDate: string,
        link: string,
        guid: string,
        author: string,
        thumbnail: string,
        description: string
    }>>([]);

    const { theme } = useTheme();

    const getPostData = () => {
        axios
            .get("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@weerasinghelahiru1999")
            .then((res) => {
                setPosts(res.data.items);
            })
            .catch((error) => {
                console.error("Error fetching blog posts:", error);
            });
    };

    useEffect(() => {
        getPostData();
    }, []);

    // Function to extract the first image URL from content
    const extractImageFromContent = (content: string): string | null => {
        const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
        return imgTagMatch ? imgTagMatch[1] : null; // Return the image URL or null if not found
    };

    // Function to extract the first 250 characters from the first <p> tag
    const extractFirstParagraph = (content: string): string => {
        const paragraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/);
        if (paragraphMatch) {
            const paragraphText = paragraphMatch[1].replace(/<[^>]*>/g, ''); // Remove any nested HTML tags
            return paragraphText.length > 250 ? `${paragraphText.substring(0, 250)}...` : paragraphText;
        }
        return '';
    };

    // Function to extract and format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options); // Format: "Oct, 2024"
    };

    return (
            <div className={`container`}>
                <div className={`row`}>
                    <div className="row">
                        {posts.map((post: any, index: React.Key) => (
                                <HanzCardArticleContainer
                                key={`post-${index}`}
                                img={extractImageFromContent(post.content) || "https://via.placeholder.com/300"}
                                title={post.title}
                                date={formatDate(post.pubDate)}
                                categories={post.categories}
                                text={extractFirstParagraph(post.content)}
                                articleLink={post.link}
                                author="Lahiru Weerasinghe"
                                authorImage="https://i.imgur.com/jYcqEpp.jpeg"
                                />
                                ))}
                    </div>
                </div>
            </div>
    );
}
