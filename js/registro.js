// URL base de la API del profesor
const API_URL = "http://localhost:3000/api"; //

// Captura de elementos globales del DOM
const multiStepForm = document.getElementById('multiStepForm');
const errorBox = document.getElementById('error-box');
const successBox = document.getElementById('success-box');
const progressLine = document.getElementById('progressLine');

// FUNCION GLOBAL: Procesa y valida el avance entre pasos (Accionada por el HTML) [cite: 117]
window.handleNextStep = function(current) {
    // Escondemos errores globales y locales previos [cite: 141]
    errorBox.style.display = 'none';
    clearInputErrors();

    let isStepValid = true;

    // Validaciones estrictas del Paso 1 (Credenciales básicas) [cite: 117, 136]
    if (current === 1) {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;

        // Formato regex para verificar correos válidos [cite: 138]
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            showFieldError('reg-name', 'err-name', 'El nombre completo es obligatorio.'); // [cite: 137, 308, 416]
            isStepValid = false;
        }
        if (!email || !emailRegex.test(email)) {
            showFieldError('reg-email', 'err-email', 'Ingresa un correo electrónico válido.'); // [cite: 138, 417]
            isStepValid = false;
        }
        // Exigencia de la Rúbrica: Contraseña segura con mínimo 8 caracteres [cite: 119, 139, 309, 432]
        if (password.length < 8) {
            showFieldError('reg-password', 'err-password', 'La contraseña debe tener mínimo 8 caracteres.'); // [cite: 119, 309]
            isStepValid = false;
        }
        if (password !== confirm) {
            showFieldError('reg-confirm', 'err-confirm', 'Las contraseñas no coinciden.'); // [cite: 119, 140, 433]
            isStepValid = false;
        }
    }

    // Validaciones del Paso 2 (Datos de perfil) [cite: 137]
    if (current === 2) {
        const age = document.getElementById('reg-age').value;
        if (!age) {
            showFieldError('reg-age', 'err-age', 'Por favor ingresa tu edad.'); // [cite: 137]
            isStepValid = false;
        }
    }

    // Si hay un error de validación local, frena el cambio de pestaña [cite: 141]
    if (!isStepValid) {
        errorBox.innerText = "Por favor, corrige los campos marcados en rojo antes de continuar."; // [cite: 121, 141, 304, 413]
        errorBox.style.display = 'block';
        return;
    }

    // Cambiar de paso visualmente en la pantalla
    document.getElementById(`step-${current}`).classList.remove('step-active');
    document.getElementById(`step-${current + 1}`).classList.add('step-active');
    updateProgressGrid(current + 1);
}

// FUNCION GLOBAL: Permite retroceder de pestaña de forma segura
window.handlePrevStep = function(current) {
    errorBox.style.display = 'none';
    clearInputErrors();
    document.getElementById(`step-${current}`).classList.remove('step-active');
    document.getElementById(`step-${current - 1}`).classList.add('step-active');
    updateProgressGrid(current - 1);
}

// Actualiza de forma matemática la barra morada superior y los círculos
function updateProgressGrid(step) {
    document.querySelectorAll('.step-indicator').forEach((ind, idx) => {
        if (idx < step) ind.classList.add('active');
        else ind.classList.remove('active');
    });
    progressLine.style.width = ((step - 1) / 2 * 100) + '%';
}

// --- CONSUMO REAL DE LA API MEDIANTE EL EVENTO SUBMIT DEL FORMULARIO --- [cite: 117, 143]
multiStepForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    try {
        // Hacemos el fetch real tipo POST al endpoint del docente
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: name,
                email: email,
                password: password
            }) // Envía la estructura exacta que espera el modelo del backend
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            // Éxito: Escribe el feedback en color verde (Prohibido alert) [cite: 121, 141, 437]
            successBox.innerText = "¡Usuario registrado correctamente en la base de datos! Redirigiendo..."; // [cite: 437]
            successBox.style.display = "block";
            multiStepForm.reset();
            updateProgressGrid(1);

            // Temporizador para redirigir al Login tras el éxito
            setTimeout(() => { 
                window.location.href = "Login.html"; 
            }, 2500);

        } else {
            // Maneja fallos del backend en pantalla (Ej: El correo ya existe en SQLite) [cite: 121, 141]
            errorBox.innerText = result.message || "Error al registrar el usuario.";
            errorBox.style.display = 'block';
        }

    } catch (error) {
        console.error("Error en el registro Fetch:", error);
        errorBox.innerText = "Error: No se pudo conectar con el servidor backend.";
        errorBox.style.display = 'block';
    }
});

// Helper de UI: Inyecta los bordes rojos y los mensajes explicativos en los inputs (Exigido) 
function showFieldError(inputId, spanId, text) {
    const field = document.getElementById(inputId);
    const span = document.getElementById(spanId);
    if (field && span) {
        field.style.borderColor = "#dc3545"; // Input con borde rojo [cite: 305, 415]
        span.innerText = text; // Mensaje abajo del input [cite: 303, 411]
        span.style.display = "block";
    }
}

// Limpia las marcas rojas del intento previo
function clearInputErrors() {
    document.querySelectorAll('.form-step input').forEach(input => {
        input.style.borderColor = ""; 
    });
    document.querySelectorAll('.form-step span').forEach(span => {
        span.style.display = "none";
    });
}