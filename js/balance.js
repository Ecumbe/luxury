import { db } from './firebaseConfig.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import jsPDF from 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js';

document.getElementById('generate-sales-report').addEventListener('click', async () => {
    const startDate = new Date(document.getElementById('sales-start-date').value);
    const endDate = new Date(document.getElementById('sales-end-date').value);
    const employeePercentage = parseFloat(document.getElementById('employee-percentage').value) || 0;

    if (isNaN(employeePercentage) || !startDate || !endDate) {
        alert("Por favor ingrese fechas y porcentaje válidos.");
        return;
    }

    const salesData = [];
    const q = query(collection(db, 'ventas'), where('fecha', '>=', startDate), where('fecha', '<=', endDate));
    const querySnapshot = await getDocs(q);
    
    let totalAmount = 0;
    querySnapshot.forEach(doc => {
        const data = doc.data();
        salesData.push(data);
        totalAmount += data.valor;
    });

    const employeePay = (totalAmount * employeePercentage) / 100;

    const doc = new jsPDF();
    doc.text('Reporte de Ventas', 10, 10);
    doc.text(`Total Ventas: ${totalAmount}`, 10, 20);
    doc.text(`Porcentaje Empleado (${employeePercentage}%): ${employeePay}`, 10, 30);

    salesData.forEach((sale, index) => {
        doc.text(`${index + 1}. Fecha: ${sale.fecha}, Productos: ${sale.productos}, Valor: ${sale.valor}`, 10, 40 + (index * 10));
    });
    
    doc.save('Reporte_Ventas.pdf');
});

document.getElementById('generate-appointments-report').addEventListener('click', async () => {
    const startDate = new Date(document.getElementById('appointments-start-date').value);
    const endDate = new Date(document.getElementById('appointments-end-date').value);

    if (!startDate || !endDate) {
        alert("Por favor ingrese fechas válidas.");
        return;
    }

    const appointmentsData = [];
    const q = query(collection(db, 'citas'), where('fecha', '>=', startDate), where('fecha', '<=', endDate));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        appointmentsData.push(doc.data());
    });

    const doc = new jsPDF();
    doc.text('Reporte de Citas', 10, 10);

    appointmentsData.forEach((appointment, index) => {
        doc.text(`${index + 1}. Fecha: ${appointment.fecha}, Nombre: ${appointment.nombre}, Hora: ${appointment.hora}`, 10, 30 + (index * 10));
    });

    doc.save('Reporte_Citas.pdf');
});

document.getElementById('back').addEventListener('click', () => {
    window.location.href = 'menu.html';
});
