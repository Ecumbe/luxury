// js/productos.js

import { db } from './firebaseConfig.js'; // Asegúrate de exportar la referencia de la base de datos en firebaseConfig.js
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const backButton = document.getElementById('back');

const productsCollection = collection(db, 'productos'); // Cambia 'productos' al nombre de tu colección en Firestore

// Agregar un nuevo producto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    
    try {
        await addDoc(productsCollection, {
            name: productName,
            price: productPrice
        });
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        loadProducts(); // Cargar productos después de agregar uno
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
});

// Cargar productos desde Firestore
const loadProducts = async () => {
    const productSnapshot = await getDocs(productsCollection);
    productList.innerHTML = ''; // Limpiar la lista antes de cargar
    productSnapshot.forEach((doc) => {
        const product = doc.data();
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <span>${product.name} - $${product.price.toFixed(2)}</span>
            <div>
                <button onclick="editProduct('${doc.id}', '${product.name}', ${product.price})">Editar</button>
                <button onclick="deleteProduct('${doc.id}')">Borrar</button>
            </div>
        `;
        productList.appendChild(productItem);
    });
};

// Borrar un producto
window.deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(productsCollection, id));
        loadProducts(); // Recargar productos después de borrar
    } catch (error) {
        console.error("Error al borrar el producto:", error);
    }
};

// Editar un producto
window.editProduct = async (id, currentName, currentPrice) => {
    const newName = prompt("Nuevo nombre del producto:", currentName);
    const newPrice = parseFloat(prompt("Nuevo precio del producto:", currentPrice));
    
    if (newName && !isNaN(newPrice)) {
        try {
            await updateDoc(doc(productsCollection, id), {
                name: newName,
                price: newPrice
            });
            loadProducts(); // Recargar productos después de editar
        } catch (error) {
            console.error("Error al editar el producto:", error);
        }
    } else {
        alert("Por favor ingrese valores válidos.");
    }
};

// Cargar productos al iniciar la página
loadProducts();

// Manejar el botón de atrás
backButton.addEventListener('click', () => {
    window.location.href = "menu.html";
});
