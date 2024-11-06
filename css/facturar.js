// js/facturar.js

import { db, auth } from './firebaseConfig.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

const productList = document.getElementById('product-list');
const totalAmount = document.getElementById('total-amount');
const paymentMethod = document.getElementById('payment-method');
const accountSelection = document.getElementById('account-selection');
const account = document.getElementById('account');
const saveInvoiceButton = document.getElementById('save-invoice');
const facturaDate = document.getElementById('factura-date');
let selectedProducts = [];
let total = 0;

// Mostrar productos desde Firebase
async function loadProducts() {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    productList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        
        productItem.innerHTML = `
            <input type="checkbox" data-name="${product.name}" data-price="${product.price}">
            <label>${product.name} - $${product.price.toFixed(2)}</label>
        `;
        
        productList.appendChild(productItem);
    });

    document.querySelectorAll('.product-item input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const price = parseFloat(e.target.getAttribute('data-price'));
            if (e.target.checked) {
                selectedProducts.push(e.target.getAttribute('data-name'));
                total += price;
            } else {
                selectedProducts = selectedProducts.filter(name => name !== e.target.getAttribute('data-name'));
                total -= price;
            }
            totalAmount.textContent = total.toFixed(2);
        });
    });
}

// Cambiar la visibilidad de la selección de cuenta
paymentMethod.addEventListener('change', () => {
    accountSelection.style.display = paymentMethod.value === 'transferencia' ? 'block' : 'none';
});

// Guardar factura en Firebase
saveInvoiceButton.addEventListener('click', async () => {
    if (!facturaDate.value || selectedProducts.length === 0) {
        alert("Por favor, complete la fecha y seleccione al menos un producto.");
        return;
    }

    const t_pago = paymentMethod.value;
    const cuenta = t_pago === 'transferencia' ? account.value : '';

    try {
        await addDoc(collection(db, 'ventas'), {
            fecha: facturaDate.value,
            productos: selectedProducts.join(', '),
            t_pago,
            cuenta,
            valor: total
        });
        alert("Factura guardada exitosamente.");
        selectedProducts = [];
        total = 0;
        totalAmount.textContent = '0.00';
        loadProducts();
    } catch (error) {
        console.error("Error al guardar la factura:", error);
    }
});

// Cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
});

// Regresar al menú
document.getElementById('back').addEventListener('click', () => {
    window.location.href = "menu.html";
});

// Cargar productos al iniciar
loadProducts();
