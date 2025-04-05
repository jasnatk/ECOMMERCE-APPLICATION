import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axiosInstance";

export const useFetch = (url) => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance({ method: "GET", url });
            setData(response?.data?.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    // Fetch data whenever `url` changes
    useEffect(() => {
        fetchData();
    }, [url]);  

    return [data, isLoading, error, fetchData];  // Return fetchData for manual refetch
};
