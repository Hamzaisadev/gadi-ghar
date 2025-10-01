import React, { useState } from "react";
const { toast } = require("sonner");

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      
      // Handle undefined or null response
      if (response === undefined || response === null) {
        const errorMessage = 'Received undefined or null response from server';
        console.error('❌ useFetch: ' + errorMessage);
        const error = new Error(errorMessage);
        setError(error);
        toast.error('Failed to load data from server');
        return { success: false, error: errorMessage };
      }
      
      // Handle error response with success: false
      if (response && response.success === false) {
        const message = response.message || response.error || "Request failed";
        const error = new Error(message);
        error.code = response.error; // Preserve error code if available
        console.error('❌ useFetch: Request failed:', message);
        setError(error);
        // Don't show toast here, let the component handle it
        return { success: false, error: message, data: response.data || null };
      }

      // Handle successful response with data
      if (response && response.success !== false) {
        setData(response);
        setError(null);
        return { success: true, data: response.data || response };
      }

      // Handle unexpected response format
      const errorMessage = 'Unexpected response format from server';
      const error = new Error(errorMessage);
      setError(error);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error.message || 'An unknown error occurred';
      console.error("❌ useFetch: Error occurred:", error);
      setError(error);
      // Don't show toast here, let the component handle it
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    fn, 
    setData,
    refetch: (status) => fn(status) // Helper for refetching with current status
  };
};

export default useFetch;
