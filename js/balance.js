import { db, auth } from './firebaseConfig.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Referencias a elementos
const startDateSales = document.getElementById('start-date-sales');
const endDateSales = document.getElementById('end-date-sales');
const employeePercentageInput = document.getElementById('employee-percentage');
const generateSalesReportButton = document.getElementById('generate-sales-report');
const startDateAppointments = document.getElementById('start-date-appointments');
const endDateAppointments = document.getElementById('end-date-appointments');
const generateAppointmentsReportButton = document.getElementById('generate-appointments-report');
const backButton = document.getElementById('back');
const logoutButton = document.getElementById('logout');

// Función para generar reporte de ventas en PDF
async function generateSalesReport() {
    if (!startDateSales.value || !endDateSales.value) {
        alert('Seleccione ambas fechas.');
        return;
    }

    const percentage = parseFloat(employeePercentageInput.value) || 0;

    const q = query(
        collection(db, 'ventas'),
        where('fecha', '>=', startDateSales.value),
        where('fecha', '<=', endDateSales.value)
    );

    const querySnapshot = await getDocs(q);
    const reportData = [];
    let totalValue = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        reportData.push(data);
        totalValue += data.valor;
    });

    const employeeEarnings = totalValue * (percentage / 100);

    // Llamada a función para generar el PDF
    createPDF('Reporte de Ventas', reportData, totalValue, employeeEarnings, percentage);
}

// Función para crear un PDF
function createPDF(title, data, totalValue = null, employeeEarnings = null, percentage = 0) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 10, 10);

    let yPosition = 20;

    data.forEach((item) => {
        const itemText = `${item.fecha} - ${item.productos || item['que se hara']} - $${item.valor || ''} - ${item.t_pago || ''} ${item.cuenta ? `(${item.cuenta})` : ''}`;
        doc.text(itemText, 10, yPosition);
        yPosition += 10;
    });

    if (totalValue !== null) {
        doc.text(`Total de Ventas: $${totalValue.toFixed(2)}`, 10, yPosition + 10);
        yPosition += 10;
        doc.text(`Porcentaje para Empleado (${percentage}%): $${employeeEarnings.toFixed(2)}`, 10, yPosition + 10);
    }

    doc.save(`${title}.pdf`);
}

// Función para generar reporte de citas en PDF
async function generateAppointmentsReport() {
    if (!startDateAppointments.value || !endDateAppointments.value) {
        alert('Seleccione ambas fechas.');
        return;
    }

    const q = query(
        collection(db, 'citas'),
        where('fecha', '>=', startDateAppointments.value),
        where('fecha', '<=', endDateAppointments.value)
    );

    const querySnapshot = await getDocs(q);
    const reportData = [];

    querySnapshot.forEach((doc) => {
        reportData.push(doc.data());
    });

    // Llamada a función para generar el PDF
    createPDF('Reporte de Citas', reportData);
}

// Eventos de los botones
generateSalesReportButton.addEventListener('click', generateSalesReport);
generateAppointmentsReportButton.addEventListener('click', generateAppointmentsReport);

backButton.addEventListener('click', () => {
    window.location.href = 'menu.html';
});

logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
});
