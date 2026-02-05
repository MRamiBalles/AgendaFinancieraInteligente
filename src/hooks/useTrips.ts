import { useLocalStorage } from './useLocalStorage';
import { Trip, FinancialEvent } from '../types';
import { useCallback } from 'react';

/**
 * Gestor de lógica para el módulo de viajes.
 * 
 * CONSIDERACIÓN TÉCNICA:
 * La vinculación entre viajes y eventos se realiza mediante un 'tripId'.
 * Se prefiere este enfoque relacional simple sobre el anidamiento de datos
 * para facilitar la búsqueda de gastos globales y mantener la estructura plana,
 * facilitando la persistencia y la escalabilidad a una DB real en el futuro.
 */
export function useTrips() {
    const [trips, setTrips] = useLocalStorage<Trip[]>('finance_agenda_trips', []);

    /**
     * Registra un nuevo destino vacacional.
     */
    const addTrip = useCallback((trip: Omit<Trip, 'id'>) => {
        const newTrip = { ...trip, id: crypto.randomUUID() };
        setTrips((prev) => [...prev, newTrip]);
        return newTrip;
    }, [setTrips]);

    /**
     * Actualiza datos del viaje (notas, checklist, presupuesto).
     */
    const updateTrip = useCallback((id: string, updatedData: Partial<Trip>) => {
        setTrips((prev) => prev.map((trip) => (trip.id === id ? { ...trip, ...updatedData } : trip)));
    }, [setTrips]);

    /**
     * Elimina un viaje (Nota: Los eventos vinculados conservarán el tripId pero 
     * dejarán de estar asociados visualmente).
     */
    const deleteTrip = useCallback((id: string) => {
        setTrips((prev) => prev.filter((trip) => trip.id !== id));
    }, [setTrips]);

    /**
     * Lógica de agregación para el presupuesto específico de un viaje.
     */
    const getTripBudgetStatus = useCallback((tripId: string, events: FinancialEvent[]) => {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return { totalExpenses: 0, budget: 0, remaining: 0 };

        const totalExpenses = events
            .filter(e => e.tripId === tripId && e.financials?.type === 'expense')
            .reduce((sum, e) => sum + (e.financials?.amount || 0), 0);

        return {
            totalExpenses,
            budget: trip.budget,
            remaining: trip.budget - totalExpenses
        };
    }, [trips]);

    return {
        trips,
        addTrip,
        updateTrip,
        deleteTrip,
        getTripBudgetStatus
    };
}
