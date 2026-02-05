import React, { useState } from 'react';
import { Plane, Calendar, X, Plus, Trash2, CheckSquare, Square, DollarSign, FileText, Wallet } from 'lucide-react';
import { Trip, FinancialEvent, UserSettings } from '../types';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { useSettings } from '../hooks/useSettings';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface Props {
    trips: Trip[];
    onAddTrip: (trip: Omit<Trip, 'id'>) => void;
    onUpdateTrip: (id: string, data: Partial<Trip>) => void;
    onDeleteTrip: (id: string) => void;
    events: FinancialEvent[];
    settings: UserSettings;
}

const TravelDashboard: React.FC<Props> = ({ trips, onAddTrip, onUpdateTrip, onDeleteTrip, events, settings }) => {
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [isAddingTrip, setIsAddingTrip] = useState(false);
    const [newTrip, setNewTrip] = useState({
        title: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        budget: 0,
        notes: '',
        color: '#EC4899'
    });

    const selectedTrip = trips.find(t => t.id === selectedTripId);

    const handleCreateTrip = () => {
        if (!newTrip.title) return;
        onAddTrip({
            ...newTrip,
            packingList: []
        });
        setIsAddingTrip(false);
        setNewTrip({
            title: '',
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
            budget: 0,
            notes: '',
            color: '#EC4899'
        });
    };

    const getTripExpenses = (tripId: string) => {
        return events.filter(e => e.tripId === tripId && e.financials?.type === 'expense');
    };

    const calculateTripTotal = (tripId: string) => {
        return getTripExpenses(tripId).reduce((sum, e) => sum + (e.financials?.amount || 0), 0);
    };

    return (
        <div className="flex gap-6 h-full overflow-hidden">
            {/* Sidebar de Viajes */}
            <div className="w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Mis Viajes</h2>
                    <button
                        onClick={() => setIsAddingTrip(true)}
                        className="p-2 bg-accent-pink/20 text-accent-pink rounded-lg hover:bg-accent-pink/30 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                    {trips.map(trip => {
                        const totalSpent = calculateTripTotal(trip.id);
                        const isSelected = selectedTripId === trip.id;

                        return (
                            <motion.div
                                key={trip.id}
                                layoutId={trip.id}
                                onClick={() => setSelectedTripId(trip.id)}
                                className={cn(
                                    "glass-card p-4 cursor-pointer transition-all duration-300",
                                    isSelected ? "ring-2 ring-accent-pink border-accent-pink/50 scale-[1.02]" : "hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${trip.color}20`, color: trip.color }}>
                                        <Plane size={18} />
                                    </div>
                                    <h3 className="font-semibold truncate">{trip.title}</h3>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>{format(parseISO(trip.startDate), 'dd MMM', { locale: es })} - {format(parseISO(trip.endDate), 'dd MMM', { locale: es })}</span>
                                    <span className={cn(totalSpent > trip.budget ? "text-red-400 font-bold" : "text-emerald-400")}>
                                        {settings.currency}{totalSpent} / {settings.currency}{trip.budget}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Detalle del Viaje */}
            <div className="flex-1 overflow-y-auto pr-2">
                <AnimatePresence mode="wait">
                    {selectedTrip ? (
                        <motion.div
                            key={selectedTrip.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{selectedTrip.title}</h1>
                                    <p className="text-slate-400 flex items-center gap-2">
                                        <Calendar size={16} />
                                        {format(parseISO(selectedTrip.startDate), 'PPP', { locale: es })} - {format(parseISO(selectedTrip.endDate), 'PPP', { locale: es })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onDeleteTrip(selectedTrip.id)}
                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {/* Presupuesto Card */}
                                <div className="glass-card p-6 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                        <Wallet size={16} /> Presupuesto
                                    </div>
                                    <div className="text-3xl font-bold">{settings.currency}{selectedTrip.budget}</div>
                                    <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-500", calculateTripTotal(selectedTrip.id) > selectedTrip.budget ? "bg-red-500" : "bg-emerald-500")}
                                            style={{ width: `${Math.min((calculateTripTotal(selectedTrip.id) / selectedTrip.budget) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Gastado: {settings.currency}{calculateTripTotal(selectedTrip.id)}</p>
                                </div>

                                {/* Itinerario Card */}
                                <div className="glass-card p-6 flex flex-col gap-2 col-span-2">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                        <FileText size={16} /> Notas y Documentación
                                    </div>
                                    <textarea
                                        value={selectedTrip.notes || ''}
                                        onChange={(e) => onUpdateTrip(selectedTrip.id, { notes: e.target.value })}
                                        className="glass-input w-full h-24 bg-transparent resize-none focus:ring-0 border-none p-0 text-sm"
                                        placeholder="Vuelos, reservas, links..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Packing List */}
                                <div className="glass-card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <CheckSquare size={18} /> Lista de Equipaje
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const newItem = { id: crypto.randomUUID(), text: '', completed: false };
                                                onUpdateTrip(selectedTrip.id, { packingList: [...selectedTrip.packingList, newItem] });
                                            }}
                                            className="text-xs text-accent-pink hover:underline"
                                        >
                                            Añadir item
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedTrip.packingList.map(item => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        const newList = selectedTrip.packingList.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i);
                                                        onUpdateTrip(selectedTrip.id, { packingList: newList });
                                                    }}
                                                    className="text-slate-500"
                                                >
                                                    {item.completed ? <CheckSquare size={18} className="text-emerald-500" /> : <Square size={18} />}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.text}
                                                    onChange={(e) => {
                                                        const newList = selectedTrip.packingList.map(i => i.id === item.id ? { ...i, text: e.target.value } : i);
                                                        onUpdateTrip(selectedTrip.id, { packingList: newList });
                                                    }}
                                                    className={cn("bg-transparent border-none focus:ring-0 p-0 text-sm w-full", item.completed && "line-through opacity-50")}
                                                    placeholder="Nuevo item..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newList = selectedTrip.packingList.filter(i => i.id !== item.id);
                                                        onUpdateTrip(selectedTrip.id, { packingList: newList });
                                                    }}
                                                    className="text-slate-600 hover:text-red-400"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gastos del Viaje */}
                                <div className="glass-card p-6">
                                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                                        <DollarSign size={18} /> Gastos Detallados
                                    </h3>
                                    <div className="space-y-3">
                                        {getTripExpenses(selectedTrip.id).length > 0 ? (
                                            getTripExpenses(selectedTrip.id).map(e => (
                                                <div key={e.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div>
                                                        <div className="text-sm font-medium">{e.title}</div>
                                                        <div className="text-[10px] text-slate-500">{format(parseISO(e.date), 'dd MMM')}</div>
                                                    </div>
                                                    <div className="text-red-400 font-bold">-{settings.currency}{e.financials?.amount}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 text-center py-4 italic">No hay gastos asociados aún.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Plane size={48} className="mb-4 opacity-20" />
                            <p>Selecciona un viaje o crea uno nuevo para empezar</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal para Crear Viaje */}
            <AnimatePresence>
                {isAddingTrip && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsAddingTrip(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-container w-full max-w-md p-6 rounded-3xl relative"
                        >
                            <h3 className="text-xl font-bold mb-6">Nuevo Viaje</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-400 mb-1.5 block">Destino / Título</label>
                                    <input
                                        type="text"
                                        value={newTrip.title}
                                        onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                                        className="glass-input w-full"
                                        placeholder="Ej: Verano en Japón"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-400 mb-1.5 block">Inicio</label>
                                        <input
                                            type="date"
                                            value={newTrip.startDate}
                                            onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                                            className="glass-input w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 mb-1.5 block">Fin</label>
                                        <input
                                            type="date"
                                            value={newTrip.endDate}
                                            onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                                            className="glass-input w-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-1.5 block">Presupuesto Estimado</label>
                                    <input
                                        type="number"
                                        value={newTrip.budget}
                                        onChange={(e) => setNewTrip({ ...newTrip, budget: Number(e.target.value) })}
                                        className="glass-input w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setIsAddingTrip(false)} className="flex-1 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all">Cancelar</button>
                                    <button onClick={handleCreateTrip} className="flex-1 px-4 py-2 bg-accent-pink rounded-xl font-bold">Crear Viaje</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TravelDashboard;
