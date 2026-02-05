import React, { useState, useEffect } from 'react';
import { X, Bell, DollarSign, Clock, Tag, Plane, Link as LinkIcon } from 'lucide-react';
import { FinancialEvent, Category, FinancialType, Trip } from '../types';
import { format } from 'date-fns';
import { useSettings } from '../hooks/useSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<FinancialEvent, 'id'> | FinancialEvent) => void;
    onDelete?: (id: string) => void;
    selectedDate?: Date;
    eventToEdit?: FinancialEvent | null;
    trips: Trip[];
}

const CATEGORIES: { label: string; value: Category; color: string }[] = [
    { label: 'Trabajo', value: 'work', color: '#3B82F6' },
    { label: 'Personal', value: 'personal', color: '#8B5CF6' },
    { label: 'Finanzas', value: 'finance', color: '#10B981' },
    { label: 'Viaje', value: 'travel', color: '#EC4899' },
    { label: 'Otro', value: 'other', color: '#64748b' },
];

const EventModal: React.FC<Props> = ({ isOpen, onClose, onSave, onDelete, selectedDate, eventToEdit, trips }) => {
    const { settings } = useSettings();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Category>('personal');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [financialType, setFinancialType] = useState<FinancialType>('none');
    const [amount, setAmount] = useState<number>(0);
    const [remindMe, setRemindMe] = useState(false);
    const [color, setColor] = useState('#8B5CF6');
    const [tripId, setTripId] = useState<string>('');
    const [documentation, setDocumentation] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDescription(eventToEdit.description || '');
            setCategory(eventToEdit.category);
            setStartTime(eventToEdit.startTime);
            setEndTime(eventToEdit.endTime);
            setFinancialType(eventToEdit.financials?.type || 'none');
            setAmount(eventToEdit.financials?.amount || 0);
            setRemindMe(eventToEdit.remindMe);
            setColor(eventToEdit.color);
            setTripId(eventToEdit.tripId || '');
            setDocumentation(eventToEdit.documentation || '');
        } else {
            setTitle('');
            setDescription('');
            setCategory('personal');
            setStartTime('09:00');
            setEndTime('10:00');
            setFinancialType('none');
            setAmount(0);
            setRemindMe(false);
            setColor('#8B5CF6');
            setTripId('');
            setDocumentation('');
        }
    }, [eventToEdit, isOpen]);

    const handleSave = () => {
        if (!title) return;

        const eventData = {
            title,
            description,
            date: eventToEdit ? eventToEdit.date : format(selectedDate || new Date(), 'yyyy-MM-dd'),
            startTime,
            endTime,
            category,
            color,
            financials: financialType !== 'none' ? { type: financialType, amount } : undefined,
            remindMe,
            tripId: tripId || undefined,
            documentation,
        };

        if (eventToEdit) {
            onSave({ ...eventData, id: eventToEdit.id });
        } else {
            onSave(eventData);
        }
        onClose();
    };

    const handleCategoryChange = (val: Category) => {
        setCategory(val);
        const cat = CATEGORIES.find(c => c.value === val);
        if (cat) setColor(cat.color);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="glass-container w-full max-w-lg rounded-3xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-xl z-10">
                        <h3 className="text-xl font-semibold">
                            {eventToEdit ? 'Editar Actividad' : 'Nueva Actividad'}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="text-sm text-slate-400 mb-1.5 block">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="¿Qué tienes planeado?"
                                className="glass-input w-full text-lg font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2">
                                    <Clock size={14} /> Inicio
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2">
                                    <Clock size={14} /> Fin
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2">
                                <Tag size={14} /> Categoría
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => handleCategoryChange(cat.value)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                            category === cat.value
                                                ? "border-transparent text-white"
                                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                        )}
                                        style={{ backgroundColor: category === cat.value ? cat.color : undefined }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trip Link */}
                        <div>
                            <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2">
                                <Plane size={14} /> Vincular a Viaje (Opcional)
                            </label>
                            <select
                                value={tripId}
                                onChange={(e) => setTripId(e.target.value)}
                                className="glass-input w-full appearance-none bg-black/40"
                            >
                                <option value="">Ningún viaje</option>
                                {trips.map(trip => (
                                    <option key={trip.id} value={trip.id}>{trip.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <label className="text-sm text-slate-400 mb-3 block flex items-center gap-2">
                                <DollarSign size={14} /> Módulo Financiero
                            </label>
                            <div className="flex gap-4 mb-4">
                                {(['none', 'income', 'expense'] as const).map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="financialType"
                                            checked={financialType === type}
                                            onChange={() => setFinancialType(type)}
                                            className="accent-accent-purple"
                                        />
                                        <span className="text-sm capitalize">
                                            {type === 'none' ? 'Ninguno' : type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {financialType !== 'none' && (
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{settings.currency}</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="glass-input w-full pl-10"
                                        placeholder="0"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Documentation / Links */}
                        <div>
                            <label className="text-sm text-slate-400 mb-1.5 block flex items-center gap-2">
                                <LinkIcon size={14} /> Documentación / Notas de Reserva
                            </label>
                            <textarea
                                value={documentation}
                                onChange={(e) => setDocumentation(e.target.value)}
                                placeholder="URLs de vuelos, hoteles, códigos de reserva..."
                                className="glass-input w-full min-h-[80px] text-sm resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between pb-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    remindMe ? "bg-accent-purple/20 text-accent-purple" : "bg-white/5 text-slate-500"
                                )}>
                                    <Bell size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Recordatorio</span>
                                    <span className="text-xs text-slate-500">Notificación local</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={remindMe}
                                    onChange={(e) => setRemindMe(e.target.checked)}
                                    className="hidden"
                                />
                            </label>

                            <div className="flex gap-3">
                                {eventToEdit && onDelete && (
                                    <button
                                        onClick={() => {
                                            onDelete(eventToEdit.id);
                                            onClose();
                                        }}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium mr-4"
                                    >
                                        Eliminar
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-accent-purple hover:bg-accent-purple/80 transition-colors rounded-xl font-semibold shadow-lg shadow-accent-purple/20"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EventModal;
