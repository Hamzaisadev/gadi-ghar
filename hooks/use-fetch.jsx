import { useState } from "react"
const { toast } = require("sonner")

const useFetch = (cb) => {
    const [data, setData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fn = async (...args) => {
        console.log('🔄 useFetch: Starting request...');
        setLoading(true)
        setError(null)

        try {
            console.log('🔄 useFetch: Calling server action...');
            const response = await cb(...args)
            console.log('✅ useFetch: Response received:', { success: response?.success, dataLength: response?.data?.length });
            setData(response)
            setError(null)

        } catch (error) {
            console.error('❌ useFetch: Error occurred:', error);
            setError(error)
            toast.error(error.message)

        } finally {
            console.log('🏁 useFetch: Request completed');
            setLoading(false)
        }
    }

    return {data , loading , error , fn , setData}
}

export default useFetch;