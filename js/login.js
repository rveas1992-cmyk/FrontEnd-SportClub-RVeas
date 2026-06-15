// 1. Capturamos los elementos del HTML usando los ID que ya tienes configurados
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// URL base del backend provisto por el profesor (corre en el puerto 3000)
const API_URL = "http://localhost:3000/api";

// 2. Escuchamos el momento exacto en que el usuario presiona el botón "Ingresar"
loginForm.addEventListener('submit', async function(event) {
    // Evitamos que la página se recargue por defecto para manejarlo con JS
    event.preventDefault();
    
    // Obtenemos los textos escritos por el usuario
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    
    // Limpiamos cualquier mensaje de error de un intento anterior
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';

    try {
        // 3. Hacemos la llamada real (Fetch) al servidor de la asignatura
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        });

        // Convertimos la respuesta del servidor en un objeto JSON entendible
        const result = await response.json();

        // 4. Si el servidor dice que los datos son correctos
        if (response.ok && result.ok) {
            
            // Guardamos el token de seguridad oficial en el localStorage
            localStorage.setItem('token', result.data.token);
            
            // Guardamos los datos de sesión para dar la bienvenida en tus dashboards
            const sessionData = {
                fullname: result.data.user.full_name,
                role: result.data.user.role,
                user: result.data.user.email
            };
            localStorage.setItem("user", JSON.stringify(sessionData));

            // 5. Evaluamos el rol real que viene de la API para redirigir
            const userRole = result.data.user.role;
            
            if (userRole === "user") {
                window.location.href = "dashboard_usuario.html";
            } else if (userRole === "coach") {
                window.location.href = "dashboard_coach.html"; // Mantenemos la ruta de tu HTML
            } else if (userRole === "admin") {
                window.location.href = "dashboard_admin.html"; // Mantenemos la ruta de tu HTML
            }

        } else {
            // 6. Si las credenciales están malas, el servidor manda un mensaje y lo mostramos en pantalla
            errorMessage.innerText = result.message || "Credenciales incorrectas. Inténtalo nuevamente.";
            errorMessage.style.display = 'block'; // Hacemos visible el div de error
        }

    } catch (error) {
        // Si el backend está apagado o no responde, caerá en esta sección
        console.error("Error de conexión:", error);
        errorMessage.innerText = "Error: El servidor backend está apagado. Inícialo con 'npm run dev'.";
        errorMessage.style.display = 'block';
    }
});