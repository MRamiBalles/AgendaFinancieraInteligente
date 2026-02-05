import { useLocalStorage } from './useLocalStorage';
import { FinancialEvent } from '../types';
import { useCallback, useMemo } from 'react';

/**
 * Hook para la gestión centralizada de actividades y lógica financiera.
 * 
 * DESIGN RATIONALE:
 * Se ha optado por un sistema de hooks personalizados en lugar de Redux o Zustand.
 * Dado que el flujo de datos es principalmente descendente y el estado no es
 * masivamente complejo, los hooks nativos ofrecen un rendimiento superior sin
 * la sobrecarga de un gestor de estado global externo.
 */
export function useEvents() {
    // Persistencia en LocalStorage: Elección consciente para garantizar 
    // privacidad total (los datos nunca salen del equipo del usuario) 
    // y latencia cero.
    const [events, setEvents] = useLocalStorage<FinancialEvent[]>('finance_agenda_events', []);

    /**
     * Añade una nueva actividad con un ID único generado en cliente.
     */
    const addEvent = useCallback((event: Omit<FinancialEvent, 'id'>) => {
        const newEvent = { ...event, id: crypto.randomUUID() };
        setEvents((prev) => [...prev, newEvent]);
        return newEvent;
    }, [setEvents]);

    /**
     * Actualización atómica de los datos de una actividad.
     */
    const updateEvent = useCallback((id: string, updatedData: Partial<FinancialEvent>) => {
        setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...updatedData } : event)));
    }, [setEvents]);

    /**
     * Elimina una actividad del registro.
     */
    const deleteEvent = useCallback((id: string) => {
        setEvents((prev) => prev.filter((event) => event.id !== id));
    }, [setEvents]);

    /**
     * Cálculo memorizado del resumen financiero global.
     * Se usa useMemo para evitar re-cálculos costosos si la lista de eventos no cambia.
     */
    const financialSummary = useMemo(() => {
        return events.reduce(
            (acc, event) => {
                if (event.financials?.type === 'income') {
                    acc.totalIncome += event.financials.amount;
                } else if (event.financials?.type === 'expense') {
                    acc.totalExpenses += event.financials.amount;
                }
                acc.balance = acc.totalIncome - acc.totalExpenses;
                return acc;
            },
            { totalIncome: 0, totalExpenses: 0, balance: 0 }
        );
    }, [events]);

    return {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        financialSummary,
    };
}
