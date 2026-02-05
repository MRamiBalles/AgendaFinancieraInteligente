# 💼 Agenda Financiera Inteligente: Tu Centro de Mando Personal

Bienvenido a tu nueva **Agenda Financiera Inteligente**. Este proyecto no es simplemente un organizador más; es una herramienta de ingeniería pensada para creadores y profesionales que valoran la privacidad, la velocidad y una estética impecable. 

Aquí, cada píxel y cada línea de código tienen un propósito: darte el control total de tu tiempo y dinero sin fricciones.

---

## ✨ ¿Por qué esta aplicación es diferente?

En un mundo lleno de aplicaciones por suscripción que rastrean tus datos, la **Agenda Financiera Inteligente** apuesta por un enfoque **Soberano**:

1.  **Privacidad por Diseño (LocalStorage)**: 
    *   Tus finanzas son asuntos tuyos. Hemos elegido `localStorage` para que la base de datos viva **exclusivamente en tu navegador**. No hay servidores intermedios, no hay rastreadores. La seguridad es física: si tú tienes el dispositivo, tú tienes los datos.
2.  **Experiencia de Usuario Premium (Glassmorphism)**: 
    *   Creemos que una herramienta que usas a diario debe ser inspiradora. La interfaz utiliza efectos de desenfoque gaussianos y gradientes dinámicos que se sienten modernos y fluidos, inspirados en los estándares visuales de mayor calidad.
3.  **Módulo de Viajes Integrado**: 
    *   No se trata solo de eventos; se trata de experiencias. Puedes planificar viajes, gestionar checklists de equipaje y vincular gastos específicos a cada destino, viendo el impacto en tu balance global en tiempo real.

---

## 🛠️ El Alma Técnica (Stack & Arquitectura)

*   **Frontend**: React + TypeScript para un desarrollo libre de errores y altamente escalable.
*   **Diseño**: Tailwind CSS v4 para una arquitectura de estilos atómica y ultra-rápida.
*   **Animaciones**: Framer Motion para asegurar que cada transición se sienta natural y profesional.
*   **Persistencia**: Un motor personalizado sobre `localStorage` con sincronización en tiempo real entre componentes y soporte para backups externos (JSON).

---

## 🚀 Cómo empezar en 30 segundos

### Requisitos Previos
*   **Node.js**: Versión 18 o superior para compatibilidad con Vite.
*   **Un Navegador Moderno**: Chrome, Firefox o Safari (necesarios para los efectos de blur).

### Instalación
1.  **Prepara el terreno**: Instala las dependencias necesarias.
    ```bash
    npm install
    ```
2.  **Lánzate**: Inicia el entorno de desarrollo.
    ```bash
    npm run dev
    ```
3.  **Explora**: Abre el enlace que aparece en la terminal (usualmente `localhost:5173`) y empieza a personalizar tu perfil desde la pestaña de **Ajustes**.

---

## 📦 Gestión de Datos y Backups
Al ser una app 100% local, recuerda usar la función de **Exportar Backup** en Ajustes periódicamente. Esto genera un archivo `.json` que puedes guardar en una nube personal o disco externo para asegurar que nunca pierdas tu planificación si cambias de equipo.

---

> [!TIP]
> **Planificación Pro**: Cuando crees un evento en el calendario, si pertenece a un viaje, selecciónalo en el desplegable. Automáticamente verás cómo el gráfico de análisis de ese viaje se actualiza con el nuevo gasto.

---
*Desarrollado con compromiso y rigor técnico para un flujo de trabajo sin límites.*
