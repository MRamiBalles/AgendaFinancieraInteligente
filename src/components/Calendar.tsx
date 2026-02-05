import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Plane } from 'lucide-react';
import { FinancialEvent, Trip } from '../types';
import { cn } from '../utils/cn';

interface Props {
    events: FinancialEvent[];
    onAddEvent: (date: Date) => void;
    onEditEvent: (event: FinancialEvent) => void;
    trips: Trip[];
}

const Calendar: React.FC<Props> = ({ events, onAddEvent, onEditEvent, trips }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="flex flex-col h-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <p className="text-slate-400 mt-1">Organiza tu tiempo y tus finanzas</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="glass-button p-2">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="glass-button p-2">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-3 flex-1">
                {calendarDays.map((day) => {
                    const dayEvents = events.filter((e) => isSameDay(new Date(e.date), day));
                    const isSelectedMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    // Buscar si el día está dentro de algún viaje
                    const activeTrip = trips.find(trip =>
                        isWithinInterval(day, {
                            start: parseISO(trip.startDate),
                            end: parseISO(trip.endDate)
                        })
                    );

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "glass-card min-h-[120px] p-3 flex flex-col group transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                                !isSelectedMonth && "opacity-30 grayscale",
                                isToday && "ring-2 ring-accent-purple ring-inset border-accent-purple/50",
                                activeTrip && "border-accent-pink/30 bg-accent-pink/[0.03]"
                            )}
                            onClick={() => onAddEvent(day)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={cn(
                                    "text-sm font-medium",
                                    isToday ? "text-accent-purple" : "text-white/70"
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {activeTrip && (
                                    <Plane size={12} className="text-accent-pink animate-pulse" />
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[80px] scrollbar-hide">
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditEvent(event);
                                        }}
                                        className="text-[10px] px-2 py-1 rounded-md truncate border-l-2 shadow-sm"
                                        style={{
                                            backgroundColor: `${event.color}20`,
                                            borderColor: event.color,
                                            color: event.color
                                        }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                <Plus size={14} className="text-white/40" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
