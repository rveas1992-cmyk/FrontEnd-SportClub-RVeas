const API_URL = "http://localhost:3000/api";

// Captura segura de componentes del DOM
const adminFormContainer = document.getElementById('admin-form-container');
const adminUserForm = document.getElementById('adminUserForm');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const btnToggleCreateAdmin = document.getElementById('btn-toggle-create-admin');
const btnAdminCancel = document.getElementById('btn-admin-cancel');
const formPlaceholder = document.getElementById('admin-form-placeholder');
const usersTableBody = document.getElementById('users-table-body');
const errorBox = document.getElementById('crud-error-box');
const successBox = document.getElementById('crud-success-box');

// Inputs
const userIdInput = document.getElementById('admin-user-id');
const nameInput = document.getElementById('admin-name');
const emailInput = document.getElementById('admin-email');
const roleSelect = document.getElementById('admin-role');
const passwordInput = document.getElementById('admin-password');
const passwordWrapper = document.getElementById('password-row-wrapper');

// Estado de sesión
const token = localStorage.getItem('token');
const sessionUser = JSON.parse(localStorage.getItem("user"));

// PROTECCIÓN DE ENTRADA
if (!token || !sessionUser || sessionUser.role !== 'admin') {
    localStorage.clear();
    window.location.href = "Login.html";
} else {
    const welcomeField = document.getElementById('welcome-admin');
    if (welcomeField) {
        welcomeField.innerText = `Consola Administrador: ${sessionUser.fullname} 🖥️`;
    }
}

// INTERRUPTOR: Crear nuevo usuario
if (btnToggleCreateAdmin) {
    btnToggleCreateAdmin.addEventListener('click', () => {
        if (adminUserForm) adminUserForm.style.display = 'block';
        if (formPlaceholder) formPlaceholder.style.display = 'none';
        if (btnToggleCreateAdmin) btnToggleCreateAdmin.style.display = 'none';
        if (errorBox) errorBox.style.display = 'none';
        if (successBox) successBox.style.display = 'none';

        if (formTitle) formTitle.innerText = "Registrar Nuevo Usuario ➕";
        if (formSubtitle) formSubtitle.innerText = "Crea una nueva cuenta asignando un rol específico.";
        if (passwordWrapper) passwordWrapper.style.display = 'block';
        if (passwordInput) passwordInput.required = true;
    });
}

if (btnAdminCancel) {
    btnAdminCancel.addEventListener('click', cerrarFormularioAdmin);
}

function cerrarFormularioAdmin() {
    if (adminUserForm) adminUserForm.style.display = 'none';
    if (formPlaceholder) formPlaceholder.style.display = 'block';
    if (btnToggleCreateAdmin) btnToggleCreateAdmin.style.display = 'block';
    if (userIdInput) userIdInput.value = '';
    if (adminUserForm) adminUserForm.reset();
    if (formTitle) formTitle.innerText = "Operaciones de Sistema";
    if (formSubtitle) formSubtitle.innerText = "Gestión de credenciales de la plataforma.";
}

// 1. LISTAR USUARIOS REALES (GET)
async function listarUsuarios() {
    if (!usersTableBody) return;
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            const usuarios = result.data;
            usersTableBody.innerHTML = '';

            document.getElementById('lbl-total-users').innerText = usuarios.length;
            document.getElementById('lbl-total-coaches').innerText = usuarios.filter(u => u.role === 'coach').length;
            document.getElementById('lbl-total-admins').innerText = usuarios.filter(u => u.role === 'admin').length;

            usuarios.forEach(user => {
                const tr = document.createElement('tr');
                const fechaOriginal = user.created_at || "";
                const fechaFormateada = fechaOriginal ? new Date(fechaOriginal).toLocaleDateString('es-CL') : "No registra";

                tr.innerHTML = `
                    <td><strong>#${user.id}</strong></td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>
                    <td><span style="background:#efecf4; color:#2e1a47; padding:3px 8px; border-radius:4px; font-weight:bold; font-size:12px;">${user.role.toUpperCase()}</span></td>
                    <td>${fechaFormateada}</td>
                    <td style="text-align: center;">
                        <button style="padding:4px 8px; background:#fff; border:1px solid #ccc; border-radius:4px; cursor:pointer; margin-right:4px;" onclick="prepararEdicion(${user.id}, '${user.full_name}', '${user.email}', '${user.role}')">✏️ Editar</button>
                        <button style="padding:4px 8px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;" onclick="eliminarUsuario(${user.id})">🗑️ Eliminar</button>
                    </td>
                `;
                usersTableBody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error(error);
        if (errorBox) {
            errorBox.innerText = "Error al sincronizar datos con el backend.";
            errorBox.style.display = 'block';
        }
    }
}

listarUsuarios();

// 2. ELIMINAR USUARIO (DELETE)
window.eliminarUsuario = async function(id) {
    if (id === sessionUser.id) {
        alert("No puedes eliminar tu propia cuenta de administrador en sesión activa.");
        return;
    }

    if (!confirm("¿Seguro que deseas eliminar este usuario de SportClub?")) return;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok && result.ok) {
            if (successBox) {
                successBox.innerText = "¡Usuario removido correctamente!";
                successBox.style.display = 'block';
            }
            cerrarFormularioAdmin();
            listarUsuarios();
        }
    } catch (error) {
        console.error(error);
    }
};

// 3. PASAR DATOS AL FORMULARIO PARA EDITAR (CON AUTO-SCROLL SUAVE)
window.prepararEdicion = function(id, name, email, role) {
    if (adminUserForm) adminUserForm.style.display = 'block';
    if (formPlaceholder) formPlaceholder.style.display = 'none';
    if (btnToggleCreateAdmin) btnToggleCreateAdmin.style.display = 'none';

    if (userIdInput) userIdInput.value = id;
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
    if (roleSelect) roleSelect.value = role;

    if (formTitle) formTitle.innerText = `Modificando Usuario #${id} 🛠️`;
    if (formSubtitle) formSubtitle.innerText = "Modifica los privilegios del registro. Por seguridad, las contraseñas se manejan desde el alta primaria.";
    if (passwordWrapper) passwordWrapper.style.display = 'none';
    if (passwordInput) passwordInput.required = false;

    // 🚀 EFECTO MÁGICO: Lleva la pantalla automáticamente hacia arriba de forma suave
    if (adminFormContainer) {
        adminFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// 4. SUBMIT FORMULARIO (POST/PUT)
if (adminUserForm) {
    adminUserForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';
        if (successBox) successBox.style.display = 'none';

        const id = userIdInput.value;
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const role = roleSelect.value;
        const password = passwordInput.value;

        const esEdicion = id !== "";

        let url = `${API_URL}/users`;
        let metodo = 'POST';
        let payload = { full_name: name, email: email, role: role, password: password };

        if (esEdicion) {
            url = `${API_URL}/users/${id}`;
            metodo = 'PUT';
            payload = { full_name: name, email: email, role: role };
        } else {
            if (password.length < 8) {
                errorBox.innerText = "La contraseña debe tener un mínimo de 8 caracteres.";
                errorBox.style.display = 'block';
                return;
            }
        }

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.ok) {
                if (successBox) {
                    successBox.innerText = esEdicion ? "¡Usuario actualizado!" : "¡Usuario registrado!";
                    successBox.style.display = 'block';
                }
                cerrarFormularioAdmin();
                listarUsuarios();
                
                // Hace scroll suave de vuelta a las alertas arriba del formulario
                if (adminFormContainer) adminFormContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (errorBox) {
                    errorBox.innerText = result.message || "Error en la operación.";
                    errorBox.style.display = 'block';
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// 5. LOGOUT
const btnLogoutAdmin = document.getElementById('btn-logout-admin');
if (btnLogoutAdmin) {
    btnLogoutAdmin.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "Login.html";
    });
}