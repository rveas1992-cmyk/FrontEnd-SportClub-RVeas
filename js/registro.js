const API_URL = "http://localhost:3000/api";

// Captura de elementos principales del DOM
const multiStepForm = document.getElementById('multiStepForm');
const errorBox = document.getElementById('error-box');
const successBox = document.getElementById('success-box');
const progressLine = document.getElementById('progressLine');

// ==========================================================================
// 🛠️ 1. FUNCIONES NATIVAS DE NAVEGACIÓN Y PASOS (MANUAL Y POR MOUSE)
// ==========================================================================

function handleNextStep(currentStep) {
    // Limpiamos alertas previas antes de evaluar
    ocultarErroresLocales();

    if (currentStep === 1) {
        // Ejecutamos la validación del Paso 1
        if (!validarPaso1()) return;

        // Si pasa, hacemos el cambio visual al Paso 2
        document.getElementById('step-1').classList.remove('step-active');
        document.getElementById('step-2').classList.add('step-active');
        document.getElementById('ind-2').classList.add('active');
        if (progressLine) progressLine.style.width = "50%";
    } 
    else if (currentStep === 2) {
        // Ejecutamos la validación del Paso 2
        if (!validarPaso2()) return;

        // Si pasa, hacemos el cambio visual al Paso 3
        document.getElementById('step-2').classList.remove('step-active');
        document.getElementById('step-3').classList.add('step-active');
        document.getElementById('ind-3').classList.add('active');
        if (progressLine) progressLine.style.width = "100%";
    }
}

function handlePrevStep(currentStep) {
    ocultarErroresLocales();
    
    if (currentStep === 2) {
        document.getElementById('step-2').classList.remove('step-active');
        document.getElementById('step-1').classList.add('step-active');
        document.getElementById('ind-2').classList.remove('active');
        if (progressLine) progressLine.style.width = "0%";
    } 
    else if (currentStep === 3) {
        document.getElementById('step-3').classList.remove('step-active');
        document.getElementById('step-2').classList.add('step-active');
        document.getElementById('ind-3').classList.remove('active');
        if (progressLine) progressLine.style.width = "50%";
    }
}

// Make functions globally available since they are called via inline HTML onclick attributes
window.handleNextStep = handleNextStep;
window.handlePrevStep = handlePrevStep;

// ==========================================================================
// 🚫 2. CONTROL INTELIGENTE DE LA TECLA "ENTER"
// ==========================================================================

multiStepForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Evitamos enviar formularios a medio terminar si se presiona Enter en inputs de texto/número
        if (event.target.tagName === 'INPUT') {
            event.preventDefault(); 
        }

        const paso1Activo = document.getElementById('step-1').classList.contains('step-active');
        const paso2Activo = document.getElementById('step-2').classList.contains('step-active');
        const paso3Activo = document.getElementById('step-3').classList.contains('step-active');

        if (paso1Activo) {
            handleNextStep(1);
        } else if (paso2Activo) {
            handleNextStep(2);
        } else if (paso3Activo) {
            // Si está en el paso 3, el Enter procesa el envío oficial del formulario entero
            multiStepForm.requestSubmit(); 
        }
    }
});

// ==========================================================================
// 🛡️ 3. FUNCIONES DE VALIDACIÓN ESTRICTA (REQUERIMIENTOS DEL PDF)
// ==========================================================================

function validarPaso1() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    let valido = true;

    // Validar Nombre Completo
    if (!name) {
        mostrarErrorLocal('reg-name', 'err-name', 'El nombre completo es obligatorio.');
        valido = false;
    }

    // Validar Email con expresión de formato estándar (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        mostrarErrorLocal('reg-email', 'err-email', 'El correo electrónico es obligatorio.');
        valido = false;
    } else if (!emailRegex.test(email)) {
        mostrarErrorLocal('reg-email', 'err-email', 'Ingresa un formato de correo válido (ej: usuario@correo.com).');
        valido = false;
    }

    // Validar Contraseña Primaria
    if (!password) {
        mostrarErrorLocal('reg-password', 'err-password', 'La contraseña es obligatoria.');
        valido = false;
    } else if (password.length < 8) {
        mostrarErrorLocal('reg-password', 'err-password', 'Debe tener un mínimo de 8 caracteres.');
        valido = false;
    }

    // Validar Confirmación
    if (!confirm) {
        mostrarErrorLocal('reg-confirm', 'err-confirm', 'Debes confirmar tu contraseña.');
        valido = false;
    } else if (password !== confirm) {
        mostrarErrorLocal('reg-confirm', 'err-confirm', 'Las contraseñas no coinciden.');
        valido = false;
    }

    if (!valido) {
        mostrarGlobalError("Por favor, corrige los campos marcados en rojo antes de avanzar.");
    }

    return valido;
}

function validarPaso2() {
    const ageInput = document.getElementById('reg-age');
    const ageValue = ageInput ? ageInput.value.trim() : "";

    if (!ageValue) {
        mostrarErrorLocal('reg-age', 'err-age', 'La edad es obligatoria para el registro.');
        mostrarGlobalError("Completa los campos requeridos en pantalla.");
        return false;
    }

    const edadNumero = parseInt(ageValue, 10);
    if (isNaN(edadNumero) || edadNumero < 12 || edadNumero > 99) {
        mostrarErrorLocal('reg-age', 'err-age', 'Debes ingresar una edad válida entre 12 y 99 años.');
        mostrarGlobalError("La edad ingresada no es permitida.");
        return false;
    }

    return true;
}

// ==========================================================================
// 🎨 4. CONTROLADORES DE RENDERIZADO VISUAL DE ALERTAS
// ==========================================================================

function mostrarErrorLocal(inputId, spanId, mensaje) {
    const input = document.getElementById(inputId);
    const span = document.getElementById(spanId);
    
    if (input) input.style.borderColor = "#dc3545"; // Bordes rojos exigidos
    if (span) {
        span.innerText = mensaje;
        span.style.display = "block"; // Muestra el texto explicativo abajo
    }
}

function ocultarErroresLocales() {
    if (errorBox) errorBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';

    // Lista de todos los inputs y spans del HTML para resetearlos limpiamente
    const inputs = ['reg-name', 'reg-email', 'reg-password', 'reg-confirm', 'reg-age'];
    const spans = ['err-name', 'err-email', 'err-password', 'err-confirm', 'err-age'];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.borderColor = "";
    });

    spans.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = "";
            el.style.display = "none";
        }
    });
}

function mostrarGlobalError(mensaje) {
    if (errorBox) {
        errorBox.innerText = mensaje;
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ==========================================================================
// 🚀 5. ENVÍO DE DATOS FINALES CONSOLIDADOS (POST /api/auth/register)
// ==========================================================================

multiStepForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    ocultarErroresLocales();

    // Captura de la totalidad de datos acumulados en las 3 pestañas
    const full_name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const age = document.getElementById('reg-age').value;
    const sport = document.getElementById('reg-sport').value.trim();
    const interest = document.getElementById('reg-interest').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name,
                email,
                password,
                // Guardamos edad, deporte y gustos organizados en la columna flexible que da el profesor
                birth_date: new Date(new Date().setFullYear(new Date().getFullYear() - age)).toISOString().split('T')[0], // Simula fecha basada en edad
                role: "user"
            })
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            if (successBox) {
                successBox.innerText = "¡Registro completado con éxito! Redirigiendo a la pantalla de acceso...";
                successBox.style.display = 'block';
            }
            multiStepForm.reset();
            
            // Esperamos 2 segundos para que alcance a leer el cartel verde y lo mandamos al Login
            setTimeout(() => {
                window.location.href = "Login.html";
            }, 2000);
        } else {
            mostrarGlobalError(result.message || "El correo electrónico ya se encuentra registrado en SportClub.");
        }
    } catch (error) {
        console.error(error);
        mostrarGlobalError("Error de red: No se pudo establecer conexión con el servidor SQLite.");
    }
});