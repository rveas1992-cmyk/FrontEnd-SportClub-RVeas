# Informe de Co-creación y Uso de Inteligencia Artificial - SportClub

## 1. Herramienta Utilizada
- Gemini (Modelos de lenguaje avanzados para optimización de desarrollo frontend).

## 2. Requerimientos Solicitados (Prompt Engineering)
Se utilizó la herramienta de IA como un asistente de maquetación arquitectónica bajo las siguientes directrices:
- Generación de estructuras semánticas HTML5 base para acelerar el desarrollo de los módulos de Dashboards independientes por rol, asegurando la inclusión de tablas responsivas y layouts basados en CSS Flexbox/Grid.
- Propuesta de variables nativas CSS (:root) basadas estrictamente en la paleta de colores corporativos entregada por el cliente (#2E1A47 y #F2B705) para garantizar consistencia visual automatizada.
- Plantilla lógica inicial para el comportamiento del formulario interactivo multipaso en la sección de registro.

## 3. Control de Calidad y Modificaciones Manuales 
El código entregado por la IA fue tratado únicamente como un borrador técnico. Se realizaron las siguientes modificaciones e implementaciones manuales críticas para asegurar el estándar profesional del sitio:
- **Refactorización de Rutas (Debugging):** Corrección manual de todas las referencias relativas de enrutamiento (`../`) tras estructurar el repositorio en directorios limpios (`/pages`, `/css`, `/assets`), dado que las propuestas iniciales de la IA rompían los enlaces y las hojas de estilo.
- **Implementación de Diseño UI/UX Avanzado:** Sustitución de fondos planos por capas complejas de diseño inmersivo (uso de `linear-gradient` combinado con imágenes en formato `cover` y propiedades de fijación de fondo `parallax`).
- **Ajuste de Accesibilidad y Consistencia:** Redimensionamiento manual mediante CSS del imagotipo corporativo en la barra de navegación superior (`.header-logo`) para evitar la deformación del menú adaptativo en resoluciones móviles, optimizando las transiciones de los estados `:hover`.
- **Validación de Reglas de Negocio:** Modificación manual de la lógica en JavaScript del formulario de registro para incorporar de manera integrada las alertas visuales en el DOM para la coincidencia de contraseñas, eliminando ventanas emergentes que afectaban la experiencia de usuario.

# Reporte de Uso de Inteligencia Artificial (IA.md)

**Asignatura:** Programación Frontend / Evaluaciones de Plataforma SportClub  
**Plataforma de Asistencia:** Gemini (Modelo de Lenguaje Avanzado)  
**Objetivo:** Co-piloto de desarrollo para la integración de la API, optimización de experiencia de usuario (UX) y persistencia en el Frontend.

---

## 1. Declaración de Alcance y Colaboración

La Inteligencia Artificial se utilizó de manera estratégica como un consultor técnico y asistente de refactorización de código para el ecosistema de **SportClub**. Todo el diseño de bases de datos (SQLite) y endpoints base corresponden a la arquitectura provista por la asignatura, mientras que la lógica de consumo asíncrono (`fetch`), validaciones por eventos de teclado y persistencia local híbrida fueron optimizadas mediante prompts iterativos.

---

## 2. Prompts Clave y Soluciones Implementadas

### A. Control y Flujo de Navegación por Teclado (Registro Multipaso)
* **Prompt Inicial:** *"Necesito que al presionar Enter en el primer step del registro, si no están los datos completos, arroje un mensaje en pantalla, verifique formato de email por Regex y avance de pestaña. Lo mismo para el Step 2, y que en el Step 3 el Enter envíe el formulario final."*
* **Solución Guiada:** Se interceptó el evento estandarizado `keydown` sobre el formulario, aplicando un `preventDefault()` selectivo para frenar el envío nativo en los campos intermedios. Se reutilizó la lógica de la función de la pauta `handleNextStep()` acoplándola a una expresión regular estricta `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` para sanitizar correos en tiempo real.

### B. Persistencia Híbrida ante Restricciones del Servidor (Dashboard de Socio)
* **Prompt Inicial:** *"La API del backend no retiene los campos avanzados de 'Deporte Favorito' y 'Metadata' al refrescar con F5 ni al actualizar el perfil. ¿Cómo puedo hacerlos persistentes sin alterar el código de la API de Node.js?"*
* **Solución Guiada:** Al identificar que el backend procesaba un modelo relacional estricto, se diseñó una solución en el Frontend basada en tiempos de carga asíncronos (`async/await`). El script `perfil.js` primero valida la sesión contra el endpoint `/auth/me` y, tras asegurar el ID único del usuario, sincroniza dinámicamente una llave estructurada en `localStorage` (`extras_user_${id}`).

### C. Optimización de Experiencia de Usuario y Control de Errores (Dashboard de Admin)
* **Prompt Inicial:** *"El botón 'Editar' del CRUD de administración funciona pero queda muy abajo en pantallas pequeñas. Necesito que suba automáticamente al formulario."*
* **Solución Guiada:** Se implementó la API nativa del DOM `scrollIntoView({ behavior: 'smooth', block: 'start' })` gatillada inmediatamente tras la inyección de variables en los inputs del formulario, erradicando fallos silenciosos y congelamientos del script causados por IDs de contingencia mal mapeados (`error-box`).

---

## 3. Reflexión Técnica y Aprendizaje

El uso de la IA en este módulo no reemplazó el análisis lógico del desarrollador, sino que aceleró la resolución de bugs críticos de sincronización (como las cargas asíncronas asincrónicas que limpiaban el LocalStorage antes de tiempo al presionar F5). 

**Competencias adquiridas gracias al feedback de la IA:**
1. Comprensión profunda de la asincronía en JavaScript y el ciclo de vida de las peticiones HTTP.
2. Manejo controlado del almacenamiento local (`localStorage`) de manera selectiva sin corromper la seguridad de los tokens de sesión.
3. Técnicas avanzadas de depuración de errores a través de la consola del navegador ante fallos de coincidencia de selectores entre el DOM del HTML y la lógica de negocio en JS.