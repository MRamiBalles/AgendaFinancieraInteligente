import React, { useState, useMemo, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Settings,
    Wallet,
    Plane,
    Menu,
    Bell,
    TrendingUp,
    TrendingDown,
    LayoutDashboard,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from './hooks/useEvents';
import { useTrips } from './hooks/useTrips';
import Calendar from './components/Calendar';
import FinancialChart from './components/FinancialChart';
import EventModal from './components/EventModal';
import TravelDashboard from './components/TravelDashboard';
import { NotificationService } from './utils/notifications';
import { FinancialEvent } from './types';
import { cn } from './utils/cn';

/**
 * Agenta Financiera Inteligente - Componente Raíz
 * 
 * ELECCIÓN ESTRUCTURAL:
 * Se ha implementado un diseño de Sidebar + Tabs para maximizar el área de trabajo
 * del calendario, que es la pieza central. La estética Glassmorphism se logra
 * mediante capas de 'backdrop-blur-xl' y opacidades variables, buscando un look
 * Apple-like que transmita orden y sofisticación.
 */
function App() {
    const [activeTab, setActiveTab] = useState<'agenda' | 'travel'>('agenda');

    // Custom Hooks: Encapsulan toda la lógica de negocio y persistencia.
    // Esto mantiene App.tsx centrado exclusivamente en la orquestación de la UI.
    const { events, addEvent, updateEvent, deleteEvent, financialSummary } = useEvents();
    const { trips, addTrip, updateTrip, deleteTrip } = useTrips();

    // Estados de UI para Modales y Navegación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [editingEvent, setEditingEvent] = useState<FinancialEvent | null>(null);
    const [chartFilter, setChartFilter] = useState<'global' | string>('global');

    // Inicialización de servicios externos (Notificaciones)
    useEffect(() => {
        NotificationService.requestPermission();
    }, []);

    /**
     * Procesa los datos para la gráfica según el filtro seleccionado (Global o Viaje específico).
     */
    const filteredChartData = useMemo(() => {
        if (chartFilter === 'global') {
            return {
                type: 'global' as const,
                income: financialSummary.totalIncome,
                expenses: financialSummary.totalExpenses
            };
        }

        const trip = trips.find(t => t.id === chartFilter);
        if (!trip) return { type: 'global' as const, income: 0, expenses: 0 };

        const tripExpenses = events
            .filter(e => e.tripId === trip.id && e.financials?.type === 'expense')
            .reduce((sum, e) => sum + (e.financials?.amount || 0), 0);

        return {
            type: 'trip' as const,
            expenses: tripExpenses,
            budget: trip.budget
        };
    }, [chartFilter, financialSummary, trips, events]);

    // Manejadores de Eventos del Calendario
    const handleAddEvent = (date: Date) => {
        setSelectedDate(date);
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: FinancialEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (eventData: any) => {
        if (editingEvent) {
            updateEvent(editingEvent.id, eventData);
        } else {
            addEvent(eventData);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar - Diseño fijo para navegación rápida */}
            <nav className="w-20 md:w-64 border-r border-white/10 flex flex-col items-center py-8 gap-10 bg-black/20 backdrop-blur-3xl z-40">
                <div className="w-12 h-12 bg-accent-purple rounded-2xl flex items-center justify-center shadow-lg shadow-accent-purple/40">
                    <Wallet className="text-white" size={24} />
                </div>

                <div className="flex flex-col gap-4 w-full px-4">
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                            activeTab === 'agenda' ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        <CalendarIcon size={22} className={activeTab === 'agenda' ? "text-accent-purple" : ""} />
                        <span className="hidden md:block font-medium">Agenda</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('travel')}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                            activeTab === 'travel' ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        <Plane size={22} className={activeTab === 'travel' ? "text-accent-pink" : ""} />
                        <span className="hidden md:block font-medium">Viajes</span>
                    </button>
                </div>

                <div className="mt-auto w-full px-4 space-y-4">
                    <div className="glass-card p-4 hidden md:block border-accent-purple/30">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Balance Global</p>
                        <p className="text-xl font-bold truncate">${financialSummary.balance.toLocaleString()}</p>
                    </div>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all w-full">
                        <Settings size={22} />
                        <span className="hidden md:block font-medium">Ajustes</span>
                    </button>
                </div>
            </nav>

            {/* Main Area - Contenedor con scroll controlado para mantener la UI estática */}
            <main className="flex-1 overflow-hidden relative">
                <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 z-30 relative bg-[#030712]/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 glass-button">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {activeTab === 'agenda' ? 'Dashboard Financiero' : 'Planificador de Viajes'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Quick Metrics Header */}
                        <div className="hidden sm:flex gap-6 mr-6">
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Ingresos</p>
                                <p className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                                    <TrendingUp size={14} /> ${financialSummary.totalIncome}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Gastos</p>
                                <p className="text-red-400 font-bold flex items-center justify-end gap-1">
                                    <TrendingDown size={14} /> ${financialSummary.totalExpenses}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 glass-button relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-pink rounded-full border-2 border-[#030712]"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink border border-white/20"></div>
                    </div>
                </header>

                <div className="p-8 h-[calc(100vh-80px)] overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'agenda' ? (
                            <motion.div
                                key="agenda"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
                            >
                                <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        <Calendar
                                            events={events}
                                            onAddEvent={handleAddEvent}
                                            onEditEvent={handleEditEvent}
                                            trips={trips}
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-4 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Financial Analysis Section */}
                                    <section className="glass-card p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <LayoutDashboard size={18} className="text-accent-purple" /> Análisis
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs bg-white/5 p-1 rounded-lg border border-white/10">
                                                <Filter size={12} className="text-slate-500 ml-1" />
                                                <select
                                                    value={chartFilter}
                                                    onChange={(e) => setChartFilter(e.target.value)}
                                                    className="bg-transparent border-none focus:ring-0 text-slate-300 cursor-pointer pr-6"
                                                >
                                                    <option value="global">Global</option>
                                                    {trips.map(t => (
                                                        <option key={t.id} value={t.id}>{t.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <FinancialChart {...filteredChartData} />
                                    </section>

                                    {/* Recent Activity List */}
                                    <section className="glass-card p-6">
                                        <h3 className="text-lg font-bold mb-4">Próximos Eventos</h3>
                                        <div className="space-y-4">
                                            {events.slice(0, 5).map(event => (
                                                <div key={event.id} className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group" onClick={() => handleEditEvent(event)}>
                                                    <div className="w-1 h-10 rounded-full transition-all group-hover:scale-y-125" style={{ backgroundColor: event.color }}></div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-semibold truncate">{event.title}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase">{event.date} • {event.startTime}</p>
                                                    </div>
                                                    {event.financials && (
                                                        <div className={cn("ml-auto font-bold text-sm", event.financials.type === 'income' ? "text-emerald-400" : "text-red-400")}>
                                                            {event.financials.type === 'income' ? '+' : '-'}${event.financials.amount}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {events.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">No hay actividades registradas.</p>}
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="travel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="h-full"
                            >
                                <TravelDashboard
                                    trips={trips}
                                    onAddTrip={addTrip}
                                    onUpdateTrip={updateTrip}
                                    onDeleteTrip={deleteTrip}
                                    events={events}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Persistence Modal - Se inyecta globalmente para evitar duplicidad de DOM */}
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={deleteEvent}
                selectedDate={selectedDate}
                eventToEdit={editingEvent}
                trips={trips}
            />
        </div>
    );
}

export default App;
