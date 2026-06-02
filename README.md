# SportClub - Sistema Web Estático 🏋️‍♂️💻

Sitioweb estático moderno, estructurado y visualmente consistente desarrollado para el club deportivo **SportClub**, alineado al cumplimiento de los requerimientos técnicos de la Evaluación Sumativa 1.

## 👤 Información del Estudiante
- **Nombre:** Ricardo Alfonso Veas Ramírez
- **RUT:** 18.178.130-0
- **Asignatura:** Programación Front End (T13V31)
- **Docente:** Javier Ahumada
- **Institución:** INACAP

---

##  Características del Proyecto
El sistema transmite una identidad deportiva moderna, motivacional y tecnológica utilizando la paleta corporativa oficial del cliente:
-  **Morado Oscuro:** `#2E1A47`
-  **Amarillo / Dorado:** `#F2B705`
-  **Blanco:** `#FFFFFF`

### Módulos Implementados al 100%:
1. **Landing Page (`index.html`):** Arquitectura semántica que incluye Header con navegación, Hero Section con llamado a la acción (CTA), Beneficios del club, Grilla de Planes comerciales, sección "Sobre el Club" (Historia, Misión y Visión) y Footer completo con redes sociales.
2. **Formularios de Acceso:** 
   - `Login.html` (Incluye accesos rápidos directos exigidos para la revisión de los perfiles Staff).
   - `registro.html` (Formulario interactivo multipaso con retroalimentación visual integrada en el DOM).
   - `recuperar.html` (Recuperación de contraseña con mensajes incrustados en la interfaz sin alertas invasivas).
3. **Dashboards Personalizados por Rol:** Interfaces independientes con layouts dinámicos y diferenciación de color predominante según el perfil:
   - **Socio (Azul):** Panel con bienvenida motivacional, lista de 5 reservas, tarjetas de inscripción y perfil rápido.
   - **Coach (Verde):** Panel técnico con métricas de alumnos, listado de alumnos a cargo y bloques de horarios semanales.
   - **Administrador (Rojo):** Consola central con tarjetas estadísticas globales, tabla de gestión de usuarios con RUT, reportes del día y botones operativos.

---

## 📁 Estructura del Repositorio
La distribución de archivos cumple estrictamente con el estándar semántico y limpio exigido:

SportClub/
├── assets/
│   └── img/          # Logotipos y recursos visuales de fondo (Hero y Auth)
├── css/
│   └── style.css     # Hoja de estilos unificada y responsive design
├── pages/            # Módulos de autenticación y dashboards independientes
│   ├── Login.html
│   ├── registro.html
│   ├── recuperacion.html
│   ├── dashboard_usuario.html
│   ├── dashboard_coach.html
│   └── dashboard_admin.html
├── index.html        # Landing Page principal (Raíz del proyecto)
├── IA.md             # Documentación obligatoria de co-creación con IA
└── README.md         # Documentación general del repositorio