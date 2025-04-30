import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axiosInstance";

export const useFetch = (url) => {
    const [data, setData] = useState(null); // Initialize as null for clarity
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance({ method: "GET", url });
            console.log(`Response for ${url}:`, response.data); // Debug log
            setData(response?.data);
            setIsLoading(false);
        } catch (error) {
            console.error(`Error for ${url}:`, error);
            setError(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return [data, isLoading, error, fetchData];
};