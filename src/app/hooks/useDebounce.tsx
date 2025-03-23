import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number,setLoading?: (loading: boolean) => void): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        if(value === ''){
            setLoading?.(false);
            setDebouncedValue(value);
            return;
        }
        setLoading?.(true);
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, setLoading]);

    return debouncedValue;
}

export default useDebounce;