import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        setStoredValue((prev) => {
            try {
                const valueToStore = value instanceof Function ? value(prev) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                window.dispatchEvent(new CustomEvent('storage-update', { detail: { key, value: valueToStore } }));
                return valueToStore;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return prev;
            }
        });
    };

    useEffect(() => {
        const handleUpdate = (e: any) => {
            if (e.type === 'storage-update' && e.detail.key === key) {
                setStoredValue(e.detail.value);
            } else if (e.type === 'storage' && e.key === key) {
                const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
                setStoredValue(newValue);
            }
        };

        window.addEventListener('storage-update', handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener('storage-update', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, [key, initialValue]);

    return [storedValue, setValue] as const;
}
