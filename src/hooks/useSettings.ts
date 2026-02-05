import { useLocalStorage } from './useLocalStorage';

export interface UserSettings {
    userName: string;
    currency: string;
    avatarGradient: string;
    notificationsEnabled: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
    userName: 'Usuario',
    currency: '$',
    avatarGradient: 'from-accent-purple to-accent-pink',
    notificationsEnabled: true,
};

/**
 * Hook para la gestión de preferencias del usuario.
 * Centraliza la personalización estética y funcional de la app.
 */
export function useSettings() {
    const [settings, setSettings] = useLocalStorage<UserSettings>('finance_agenda_settings', DEFAULT_SETTINGS);

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const clearAllData = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar TODOS los datos? Esta acción es irreversible.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const exportData = () => {
        const data = {
            events: JSON.parse(localStorage.getItem('finance_agenda_events') || '[]'),
            trips: JSON.parse(localStorage.getItem('finance_agenda_trips') || '[]'),
            settings: settings,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_agenda_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    return {
        settings,
        updateSettings,
        clearAllData,
        exportData,
    };
}
