# Agenda Financiera Inteligente 🚀

Una solución de escritorio web moderna, privada y de alto rendimiento para gestionar tu tiempo, finanzas y aventuras de viaje en un solo lugar.

## 🎨 Filosofía de Diseño: "Glassmorphism & Functional Flow"

Esta aplicación no es solo una herramienta de gestión; es una experiencia visual. Se ha diseñado bajo los principios de **Glassmorphism**, utilizando desenfoques de fondo (backdrop-blur) y contrastes suaves para reducir la carga cognitiva y ofrecer una estética "Premium" similar a los sistemas operativos modernos (macOS/iOS).

### Decisiones Arquitectónicas (Design Rationale)

1.  **¿Por qué LocalStorage en lugar de una Base de Datos en la nube?**
    *   **Privacidad Absoluta**: En una aplicación financiera, la privacidad es ley. Al usar `localStorage`, tus datos nunca salen de tu dispositivo.
    *   **Offline-First**: Funciona sin internet, garantizando que siempre tengas acceso a tu agenda.
    *   **Latencia Cero**: Las lecturas y escrituras son instantáneas al no depender de peticiones de red.

2.  **¿Por qué React Hooks personalizados vs Redux/Zustand?**
    *   Para la escala actual del proyecto, Redux introduce una complejidad innecesaria (Boilerplate). Hemos optado por **Custom Hooks** (`useEvents`, `useTrips`) que centralizan la lógica de negocio pero mantienen el árbol de componentes ligero y fácil de depurar.

3.  **Tailwind CSS + Framer Motion**
    *   Utilizamos Tailwind para un control total sobre el sistema de diseño sin escribir CSS personalizado redundante.
    *   **Framer Motion** orquestra las transiciones entre pestañas y modales para asegurar que la aplicación se sienta "viva" y fluida, evitando saltos bruscos en el DOM.

## 🛠️ Estructura del Proyecto

*   `/src/components`: Componentes visuales atómicos (Calendar, Charts, Modals).
*   `/src/hooks`: Cerebro de la aplicación. Aquí reside la lógica de persistencia y cálculos financieros.
*   `/src/types`: Definiciones de TypeScript para asegurar la integridad de los datos.
*   `/src/utils`: Herramientas auxiliares para estilado dinámico (`cn.ts`) y servicios (Notificaciones).

## 🚀 Instalación y Uso Rápido

### Requisitos
*   Node.js (v20.19+ recomendado)
*   npm o yarn

### Pasos
1.  Clona el repositorio o abre el directorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

> [!NOTE] 
> Esta aplicación ha sido desarrollada por un desarrollador experto priorizando la mantenibilidad del código y la experiencia de usuario final. Cada línea de código está optimizada para ser clara y extensible.
