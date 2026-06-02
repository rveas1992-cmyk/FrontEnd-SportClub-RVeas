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