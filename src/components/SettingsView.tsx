import React from 'react';
import { User, DollarSign, Trash2, Download, Bell, Palette, Globe, Upload } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { cn } from '../utils/cn';
import { UserSettings } from '../types';

const GRADIENTS = [
    { name: 'Púrpura Profundo', value: 'from-accent-purple to-accent-pink' },
    { name: 'Oceánico', value: 'from-blue-500 to-emerald-500' },
    { name: 'Atardecer', value: 'from-orange-500 to-red-500' },
    { name: 'Bosque', value: 'from-green-500 to-teal-700' },
    { name: 'Monocromo', value: 'from-slate-400 to-slate-700' },
];

const CURRENCIES = ['$', '€', '£', '¥', 'MXN', 'ARS', 'CLP', 'COP'];

interface Props {
    settings: UserSettings;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    clearAllData: () => void;
    exportData: () => void;
}

const SettingsView: React.FC<Props> = ({ settings, updateSettings, clearAllData, exportData }) => {

    return (
        <div className="h-full flex flex-col gap-8 max-w-4xl mx-auto overflow-y-auto pr-2 custom-scrollbar">
            <header>
                <h2 className="text-3xl font-bold mb-2">Configuración</h2>
                <p className="text-slate-400">Personaliza tu experiencia y gestiona tus datos locales.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Perfil */}
                <section className="glass-card p-6 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <User size={20} className="text-accent-purple" /> Perfil de Usuario
                    </h3>

                    <div>
                        <label className="text-sm text-slate-500 block mb-2">Nombre / Apodo</label>
                        <input
                            type="text"
                            value={settings.userName}
                            onChange={(e) => updateSettings({ userName: e.target.value })}
                            className="glass-input w-full"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 block mb-3">Estilo de Avatar</label>
                        <div className="flex flex-wrap gap-3">
                            {GRADIENTS.map((grad) => (
                                <button
                                    key={grad.value}
                                    onClick={() => updateSettings({ avatarGradient: grad.value })}
                                    className={cn(
                                        "w-10 h-10 rounded-xl bg-gradient-to-br transition-all hover:scale-110",
                                        grad.value,
                                        settings.avatarGradient === grad.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#030712]" : "opacity-60"
                                    )}
                                    title={grad.name}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Preferencias */}
                <section className="glass-card p-6 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Globe size={20} className="text-accent-blue" /> Preferencias Regionales
                    </h3>

                    <div>
                        <label className="text-sm text-slate-500 block mb-3 flex items-center gap-2">
                            <DollarSign size={14} /> Símbolo de Moneda
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CURRENCIES.map((cur) => (
                                <button
                                    key={cur}
                                    onClick={() => updateSettings({ currency: cur })}
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all",
                                        settings.currency === cur ? "bg-accent-blue text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                                    )}
                                >
                                    {cur}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                settings.notificationsEnabled ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-slate-500"
                            )}>
                                <Bell size={18} />
                            </div>
                            <span className="text-sm font-medium">Notificaciones Visuales</span>
                        </div>
                        <button
                            onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                            className={cn(
                                "w-12 h-6 rounded-full transition-all relative p-1",
                                settings.notificationsEnabled ? "bg-emerald-500" : "bg-slate-700"
                            )}
                        >
                            <div className={cn(
                                "w-4 h-4 bg-white rounded-full transition-all",
                                settings.notificationsEnabled ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </section>

                {/* Datos y Backup */}
                <section className="glass-card p-6 space-y-6 md:col-span-2">
                    <h3 className="text-lg font-bold">Gestión de Datos (Privacidad Total)</h3>
                    <p className="text-sm text-slate-500">
                        Tus datos se almacenan exclusivamente en este navegador. Puedes exportarlos para usarlos en otro equipo o borrarlos permanentemente.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <button
                            onClick={exportData}
                            className="glass-button bg-accent-purple/10 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/20"
                        >
                            <Download size={18} /> Exportar Backup
                        </button>

                        <label className="glass-button bg-accent-blue/10 border-accent-blue/30 text-accent-blue hover:bg-accent-blue/20 cursor-pointer">
                            <Upload size={18} /> Cargar Backup
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const data = JSON.parse(event.target?.result as string);
                                            if (data.events) localStorage.setItem('finance_agenda_events', JSON.stringify(data.events));
                                            if (data.trips) localStorage.setItem('finance_agenda_trips', JSON.stringify(data.trips));
                                            if (data.settings) localStorage.setItem('finance_agenda_settings', JSON.stringify(data.settings));
                                            window.location.reload();
                                        } catch (err) {
                                            alert('Error al importar el archivo. Formato no válido.');
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                        </label>

                        <button
                            onClick={clearAllData}
                            className="glass-button bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                        >
                            <Trash2 size={18} /> Borrar Todo
                        </button>
                    </div>
                </section>
            </div>

            <footer className="text-center text-slate-600 text-[10px] py-4">
                Versión 1.2.0 • Agenda Financiera Inteligente © 2026
            </footer>
        </div>
    );
};

export default SettingsView;
