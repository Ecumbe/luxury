import { db, auth } from './firebaseConfig.js';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

const saveAppointmentButton = document.getElementById('save-appointment');
const message = document.getElementById('message');
const selectDateInput = document.getElementById('select-date');
const citasList = document.getElementById('citas-list');
const backButton = document.getElementById('back');
const logoutButton = document.getElementById('logout');

// Guardar cita en Firebase
saveAppointmentButton.addEventListener('click', async () => {
    const citaDate = document.getElementById('cita-date').value;
    const personName = document.getElementById('person-name').value;
    const appointmentDescription = document.getElementById('appointment-description').value;
    const appointmentTime = document.getElementById('appointment-time').value;

    if (!citaDate || !personName || !appointmentDescription || !appointmentTime) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        // Agregar cita a Firebase
        await addDoc(collection(db, 'citas'), {
            fecha: citaDate,
            nombre: personName,
            descripcion: appointmentDescription,
            hora: appointmentTime,
            asistio: false
        });
        message.textContent = "Cita guardada exitosamente.";

        // Limpiar formulario después de guardar
        document.getElementById('cita-date').value = '';
        document.getElementById('person-name').value = '';
        document.getElementById('appointment-description').value = '';
        document.getElementById('appointment-time').value = '';

        loadAppointments(); // Actualizar la lista de citas
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        message.textContent = "Hubo un error al guardar la cita.";
    }
});

// Mostrar citas de una fecha
selectDateInput.addEventListener('change', async () => {
    const selectedDate = selectDateInput.value;
    loadAppointments(selectedDate);
});

// Cargar citas
async function loadAppointments(date = "") {
    if (!date) return;

    const q = query(collection(db, 'citas'), where('fecha', '==', date));
    const querySnapshot = await getDocs(q);
    
    citasList.innerHTML = ''; // Limpiar lista

    querySnapshot.forEach((doc) => {
        const cita = doc.data();
        const citaItem = document.createElement('div');
        citaItem.innerHTML = `
            <p>${cita.fecha} - ${cita.nombre} - ${cita.descripcion} - ${cita.hora}</p>
            <div>
                <button data-id="${doc.id}" class="asistio-btn">Sí</button>
                <button data-id="${doc.id}" class="asistio-btn">No</button>
            </div>
        `;
        citasList.appendChild(citaItem);

        // Eventos para marcar asistencia
        citaItem.querySelectorAll('.asistio-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const docId = e.target.getAttribute('data-id');
                const asistio = e.target.textContent === 'Sí';
                await updateAsistio(docId, asistio);
            });
        });
    });
}

// Actualizar estado de "Asistió a la cita"
async function updateAsistio(docId, asistio) {
    try {
        const citaRef = doc(db, 'citas', docId);
        await updateDoc(citaRef, { asistio });

        const citaRow = document.querySelector(`[data-id="${docId}"]`).parentElement;
        citaRow.style.backgroundColor = asistio ? "#dbeddc" : ""; // Verde si asistió
    } catch (error) {
        console.error("Error al actualizar asistencia:", error);
    }
}

// Volver a la página anterior
backButton.addEventListener('click', () => {
    window.history.back();
});

// Cerrar sesión
logoutButton.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
});
