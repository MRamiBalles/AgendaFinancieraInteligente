export class NotificationService {
    static async requestPermission() {
        if (!("Notification" in window)) {
            console.warn("This browser does not support local notifications.");
            return false;
        }

        if (Notification.permission === "granted") return true;

        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    static async notify(title: string, options?: NotificationOptions) {
        const hasPermission = await this.requestPermission();
        if (hasPermission) {
            new Notification(title, {
                icon: '/vite.svg',
                ...options
            });
        }
    }

    static schedule(id: string, title: string, date: Date) {
        const now = new Date().getTime();
        const targetTime = date.getTime();
        const delay = targetTime - now;

        if (delay > 0) {
            setTimeout(() => {
                this.notify(title, { body: "Es momento de tu actividad programada." });
            }, delay);
        }
    }
}
