// 1) Sistema de usuarios: Matriz JSON con 3 roles y 2 cuentas por rol (Requisito Obligatorio)
const users = [
    // Cuentas de Rol: Usuario / Socio
    { user: "user1@sportclub.cl", fullname: "Javier Ahumada", password: "1234", role: "user" },
    { user: "user2@sportclub.cl", fullname: "Ricardo Veas", password: "5678", role: "user" },
    
    // Cuentas de Rol: Coach / Entrenador
    { user: "coach1@sportclub.cl", fullname: "Andrés Marcelo", password: "1234", role: "coach" },
    { user: "coach2@sportclub.cl", fullname: "Andrea Zuñiga", password: "5678", role: "coach" },
    
    // Cuentas de Rol: Administrador
    { user: "admin1@sportclub.cl", fullname: "Claudio Barrientos", password: "1234", role: "admin" },
    { user: "admin2@sportclub.cl", fullname: "Eduardo Ramirez", password: "5678", role: "admin" }
];

// Captura de elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Evento de escucha para el envío del formulario
loginForm.addEventListener('submit', function(event) {
    // Evitamos que la página se recargue automáticamente
    event.preventDefault();
    
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    
    // Ocultar mensaje de error previo
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';

    // 2) Validación: Buscar si existe un usuario que coincida con las credenciales
    const foundUser = users.find(u => u.user === emailValue && u.password === passwordValue);

    if (foundUser) {
        // 5) Guardar el objeto del usuario logueado en localStorage (sin contraseña por seguridad)
        const sessionData = {
            fullname: foundUser.fullname,
            role: foundUser.role,
            user: foundUser.user
        };
        localStorage.setItem("user", JSON.stringify(sessionData));

        // 3) Redirección: Enrutar al dashboard correspondiente según el rol del perfil detectado
        if (foundUser.role === "user") {
            window.location.href = "dashboard_usuario.html";
        } else if (foundUser.role === "coach") {
            window.location.href = "dashboard_coach.html";
        } else if (foundUser.role === "admin") {
            window.location.href = "dashboard_admin.html";
        }
    } else {
        // 4) Manejo de errores: Mostrar mensaje "Credenciales incorrectas" integrado en pantalla (NO alert)
        errorMessage.innerText = "Credenciales incorrectas. Inténtalo nuevamente.";
        errorMessage.style.display = 'block';
    }
});