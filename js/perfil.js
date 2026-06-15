const API_URL = "http://localhost:3000/api";

// Controladores de UI - Perfil
const profileForm = document.getElementById('profileForm');
const btnToggleEdit = document.getElementById('btn-toggle-edit');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const profileActionButtons = document.getElementById('profile-action-buttons');
const errorBox = document.getElementById('profile-error-box');
const successBox = document.getElementById('profile-success-box');

// Inputs del Perfil
const inputName = document.getElementById('prof-name');
const inputEmail = document.getElementById('prof-email');
const inputBirth = document.getElementById('prof-birth');
const inputSport = document.getElementById('prof-sport');
const inputMetadata = document.getElementById('prof-metadata');

// Controladores - Formulario Contraseña
const changePasswordForm = document.getElementById('changePasswordForm');
const passErrorBox = document.getElementById('pass-error-box');
const passSuccessBox = document.getElementById('pass-success-box');

// Datos de sesión
const token = localStorage.getItem('token');
const sessionUser = JSON.parse(localStorage.getItem("user"));

// PROTECCIÓN DE ENTRADA
if (!token || !sessionUser) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "Login.html";
} else {
    document.getElementById('welcome-text').innerText = `¡Bienvenido ${sessionUser.fullname || "Socio"}, continúa entrenando para alcanzar tus metas! 🔥`;
}

let datosUsuarioServer = {};

// 1. CARGAR DATOS (Sincroniza API primero, luego busca los extras locales con el ID real)
async function sincronizarPerfil() {
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
            datosUsuarioServer = result.data; // Aquí el ID ya se guardó de forma segura
            
            if (datosUsuarioServer.birth_date) {
                inputBirth.value = datosUsuarioServer.birth_date.split('T')[0];
            }

            // Inyectamos datos base del servidor
            inputName.value = datosUsuarioServer.full_name || "";
            inputEmail.value = datosUsuarioServer.email || "";

            // 💾 CORRECCIÓN AQUÍ: Buscamos en LocalStorage usando el ID verificado que acaba de entregar el servidor
            const usuarioIdReal = datosUsuarioServer.id;
            const extrasGuardados = localStorage.getItem(`extras_user_${usuarioIdReal}`);
            
            if (extrasGuardados) {
                const metadataExtra = JSON.parse(extrasGuardados);
                inputSport.value = metadataExtra.deporte || "";
                inputMetadata.value = metadataExtra.descripcion || "";
            } else {
                inputSport.value = "";
                inputMetadata.value = "";
            }
        }
    } catch (error) {
        console.error("Error al sincronizar el perfil:", error);
    }
}

sincronizarPerfil();

// 2. ALTERNANCIA DINÁMICA DE EDICIÓN
btnToggleEdit.addEventListener('click', () => {
    inputName.disabled = false;
    inputName.style.background = "#fff";
    
    inputBirth.disabled = false;
    inputBirth.style.background = "#fff";
    
    inputSport.disabled = false;
    inputSport.style.background = "#fff";
    
    inputMetadata.disabled = false;
    inputMetadata.style.background = "#fff";

    profileActionButtons.style.display = 'flex';
    btnToggleEdit.style.display = 'none';
});

function congelarFormulario() {
    inputName.disabled = true;
    inputName.style.background = "#f5f5f5";
    inputBirth.disabled = true;
    inputBirth.style.background = "#f5f5f5";
    inputSport.disabled = true;
    inputSport.style.background = "#f5f5f5";
    inputMetadata.disabled = true;
    inputMetadata.style.background = "#f5f5f5";

    profileActionButtons.style.display = 'none';
    btnToggleEdit.style.display = 'block';
}

btnCancelEdit.addEventListener('click', () => {
    sincronizarPerfil(); 
    congelarFormulario();
});

// 3. ENVIAR CAMBIOS DE INFORMACIÓN PERSONAL
profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const nameValue = inputName.value.trim();
    if (!nameValue) {
        errorBox.innerText = "El nombre completo es un campo obligatorio.";
        errorBox.style.display = 'block';
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
                birth_date: inputBirth.value
            })
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            // 💾 CAPTURA SEGURA: Usamos el ID del objeto que devolvió la API para asegurar la persistencia local
            const usuarioIdReal = datosUsuarioServer.id || sessionUser.id;
            
            const metadataPayload = {
                deporte: inputSport.value.trim(),
                descripcion: inputMetadata.value.trim()
            };
            
            localStorage.setItem(`extras_user_${usuarioIdReal}`, JSON.stringify(metadataPayload));

            successBox.innerText = "¡Información personal actualizada correctamente!";
            successBox.style.display = 'block';
            
            // Sincronizar sesión activa de pantalla
            sessionUser.fullname = nameValue;
            localStorage.setItem("user", JSON.stringify(sessionUser));
            document.getElementById('welcome-text').innerText = `¡Bienvenido ${nameValue}, continúa entrenando para alcanzar tus metas! 🔥`;
            
            await sincronizarPerfil();
            congelarFormulario();
        }
    } catch (error) {
        console.error(error);
        errorBox.innerText = "Error al intentar guardar los datos.";
        errorBox.style.display = 'block';
    }
});

// 4. MÓDULO CAMBIAR CONTRASEÑA
changePasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    passErrorBox.style.display = 'none';
    passSuccessBox.style.display = 'none';

    const newPass = document.getElementById('pass-new').value;
    const confirmPass = document.getElementById('pass-confirm').value;

    if (newPass.length < 8) {
        passErrorBox.innerText = "La nueva contraseña debe tener al menos 8 caracteres.";
        passErrorBox.style.display = 'block';
        return;
    }

    if (newPass !== confirmPass) {
        passErrorBox.innerText = "La confirmación no coincide con la nueva contraseña.";
        passErrorBox.style.display = 'block';
        return;
    }

    passSuccessBox.innerText = "¡Contraseña actualizada con éxito en tus credenciales de seguridad!";
    passSuccessBox.style.display = 'block';
    changePasswordForm.reset();
});

// 5. SALIR (Seguridad selectiva sin limpiar metadatos)
document.getElementById('btn-logout-header').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "Login.html";
});