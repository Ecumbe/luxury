// js/menu.js

import { auth } from './firebaseConfig.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Maneja el cierre de sesión
document.getElementById('logout').addEventListener('click', async () => {
    try {
        await signOut(auth);
        // Redirigir a la pantalla de inicio
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});

// Aquí puedes agregar funcionalidades para los otros botones si es necesario
document.getElementById('facturar').addEventListener('click', () => {
    // Redirigir a la página de facturación (deberás crear esta página)
    window.location.href = "facturar.html";
});

document.getElementById('productos').addEventListener('click', () => {
    // Redirigir a la página de productos (deberás crear esta página)
    window.location.href = "productos.html";
});

document.getElementById('agendar-cita').addEventListener('click', () => {
    // Redirigir a la página de agendar cita (deberás crear esta página)
    window.location.href = "agendar-cita.html";
});

document.getElementById('balance').addEventListener('click', () => {
    // Redirigir a la página de balance (deberás crear esta página)
    window.location.href = "balance.html";
});
