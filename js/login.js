import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Manejo del evento de envío del formulario
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message');

    // Limpiar mensaje de error antes de un nuevo intento
    errorMessageElement.style.display = 'none';
    errorMessageElement.textContent = '';
    console.log('Intentando iniciar sesión con correo:', email);
    try {
        // Intentar iniciar sesión con Firebase
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Inicio de sesión exitoso');
        // Redirección a la página de menú si la autenticación es exitosa
        window.location.href = "menu.html";
    } catch (error) {
        // Manejo de errores de autenticación
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error('Error de autenticación:', errorCode, errorMessage);

        // Mostrar mensaje de error en el UI
        errorMessageElement.style.display = 'block';
        if (errorCode === 'auth/user-not-found') {
            errorMessageElement.textContent = 'No se encontró un usuario con ese correo.';
        } else if (errorCode === 'auth/wrong-password') {
            errorMessageElement.textContent = 'Contraseña incorrecta.';
        } else {
            errorMessageElement.textContent = 'Hubo un error en la autenticación. Inténtalo de nuevo.';
        }
    }
});
