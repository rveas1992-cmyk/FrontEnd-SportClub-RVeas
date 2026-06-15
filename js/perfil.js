const API_URL = "http://localhost:3000/api";

// Elementos del DOM - Control de Vistas Alternables
const viewModeContainer = document.getElementById('profile-view-mode');
const editModeForm = document.getElementById('profileForm');
const btnToggleEdit = document.getElementById('btn-toggle-edit');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

// Elementos del DOM - Formularios y Alertas
const welcomeText = document.getElementById('welcome-text');
const errorBox = document.getElementById('profile-error-box');
const successBox = document.getElementById('profile-success-box');

// Tokens de sesión
const token = localStorage.getItem('token');
const sessionUser = JSON.parse(localStorage.getItem("user"));

// PROTECCIÓN DE RUTA
if (!token || !sessionUser) {
    localStorage.clear();
    window.location.href = "Login.html";
} else {
    if (sessionUser.fullname) {
        welcomeText.innerText = `¡Bienvenido ${sessionUser.fullname}, continúa entrenando para alcanzar tus metas! 🔥`;
    }
}

// Variable global para retener temporalmente los datos del usuario cargados del servidor
let datosUsuarioLocal = {};

// 1. OBTENER PERFIL Y RENDERIZAR EN MODO LECTURA
async function obtenerDatosPerfil() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            datosUsuarioLocal = result.data;

            // Rellenar la Vista de solo lectura (Modo texto)
            document.getElementById('view-prof-name').innerText = datosUsuarioLocal.full_name || "No registrado";
            document.getElementById('view-prof-email').innerText = datosUsuarioLocal.email || "No registrado";
            document.getElementById('view-prof-role').innerText = datosUsuarioLocal.role ? datosUsuarioLocal.role.toUpperCase() : "USER";
            
            if (datosUsuarioLocal.birth_date) {
                const fechaLimpia = datosUsuarioLocal.birth_date.split('T')[0];
                const parts = fechaLimpia.split('-');
                document.getElementById('view-prof-birth').innerText = `${parts[2]}/${parts[1]}/${parts[0]}`; // Formato DD/MM/YYYY
            } else {
                document.getElementById('view-prof-birth').innerText = "No especificada";
            }

            // Rellenar en paralelo los inputs ocultos del formulario para cuando el usuario de "Editar"
            document.getElementById('prof-name').value = datosUsuarioLocal.full_name || "";
            document.getElementById('prof-email').value = datosUsuarioLocal.email || "";
            document.getElementById('prof-role').value = datosUsuarioLocal.role || "";
            if (datosUsuarioLocal.birth_date) {
                document.getElementById('prof-birth').value = datosUsuarioLocal.birth_date.split('T')[0];
            }
        } else {
            errorBox.innerText = "Error al sincronizar datos.";
            errorBox.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        errorBox.innerText = "Error de red al cargar el perfil.";
        errorBox.style.display = 'block';
    }
}

// Carga inicial
obtenerDatosPerfil();

// 2. CONTROLADORES DE INTERFAZ (INTERCAMBIO DE VISTAS)
btnToggleEdit.addEventListener('click', () => {
    // Escondemos el modo texto, mostramos el formulario y ocultamos el botón principal de edición
    viewModeContainer.style.display = 'none';
    editModeForm.style.display = 'block';
    btnToggleEdit.style.display = 'none';
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
});

function ActivarModoLectura() {
    // Volvemos al estado inicial: texto visible, formulario oculto, botón de edición visible
    viewModeContainer.style.display = 'block';
    editModeForm.style.display = 'none';
    btnToggleEdit.style.display = 'block';
}

btnCancelEdit.addEventListener('click', () => {
    // Si cancela, restauramos los valores de los inputs originales por si el usuario escribió algo
    document.getElementById('prof-name').value = datosUsuarioLocal.full_name || "";
    if (datosUsuarioLocal.birth_date) {
        document.getElementById('prof-birth').value = datosUsuarioLocal.birth_date.split('T')[0];
    }
    ActivarModoLectura();
});

// 3. ENVÍO DE FORMULARIO ACTUALIZADO
editModeForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    
    const nameInput = document.getElementById('prof-name');
    const nameValue = nameInput.value.trim();
    const birthValue = document.getElementById('prof-birth').value;

    if (!nameValue) {
        nameInput.style.borderColor = "#dc3545";
        document.getElementById('prof-err-name').innerText = "El nombre es requerido.";
        document.getElementById('prof-err-name').style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: nameValue,
                birth_date: birthValue
            })
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            // Actualizamos la sesión en caché local
            sessionUser.fullname = nameValue;
            localStorage.setItem("user", JSON.stringify(sessionUser));
            welcomeText.innerText = `¡Bienvenido ${nameValue}, continúa entrenando para alcanzar tus metas! 🔥`;

            // Volvemos a pedir al servidor los datos para refrescar la vista de solo lectura limpia
            await obtenerDatosPerfil();
            
            // Volvemos a bloquear la pantalla en modo lectura
            ActivarModoLectura();

            // Mostramos cartel verde de éxito arriba de los textos fijos
            successBox.innerText = "¡Cambios guardados con éxito!";
            successBox.style.display = 'block';
        } else {
            errorBox.innerText = result.message || "Error al actualizar.";
            errorBox.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        errorBox.innerText = "Error al conectar con el servidor.";
        errorBox.style.display = 'block';
    }
});

// 4. CIERRE DE SESIÓN
document.getElementById('btn-logout-header').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "Login.html";
});