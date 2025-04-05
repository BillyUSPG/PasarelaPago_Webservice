document.addEventListener('DOMContentLoaded', () => {
  const cardNumberInput = document.getElementById('cardNumber');
  const expiryDateInput  = document.getElementById('expiryDate');
  const cvvInput  = document.getElementById('cvv');
  const form = document.getElementById('paymentForm');
  const messagesDiv = document.getElementById('messages');
  
  
  // Formatear la fecha de caducidad (MM/AA)
  expiryDateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2); // Inserta la barra "/"
    }
    e.target.value = value.slice(0, 7); // Máximo "MM/AAAA"
});

// Evitar más de 3 dígitos en CVV
cvvInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3); // Solo números y máximo 3
});


form.addEventListener('submit', function(event) {
    event.preventDefault();
    messagesDiv.innerHTML = '';
    const errorMessages = [];

/*// Formatear número de tarjeta en grupos de 4 mientras se escribe
cardNumberInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, ''); // Solo números
  value = value.replace(/(\d{4})/g, '$1 ').trim(); // Agrupa en 4
  e.target.value = value.slice(0, 19); // Máximo 19 caracteres (16 números + 3 espacios)
});*/

    // Obtener valores sin espacios
    const cardNumber = cardNumberInput.value.replace(/[\s-]+/g, '');
   let expiryDate = expiryDateInput.value.trim();
   const cvv = cvvInput.value.trim();

    // Validación del número de tarjeta 
    if (!/^\d{16}$/.test(cardNumber)) {
        errorMessages.push("Número de tarjeta inválido. Debe tener 16 dígitos.");
    }

    // Validación de la fecha de caducidad (MM/AA o MM/AAAA)
    const dateParts = expiryDate.split('/');
    if (dateParts.length !== 2 || !/^\d{2}$/.test(dateParts[0]) || !/^\d{2,4}$/.test(dateParts[1])) {
        errorMessages.push("Formato de fecha inválido. Use MM/AA o MM/AAAA.");
    } else {
        let month = parseInt(dateParts[0], 10);
        let year = dateParts[1].length === 4 ? parseInt(dateParts[1].slice(-2), 10) : parseInt(dateParts[1], 10);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            errorMessages.push("Mes de caducidad inválido.");
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            errorMessages.push("La tarjeta ha expirado.");
        }
    }

    // Validación del CVV (3 dígitos)
    if (!/^\d{3}$/.test(cvv)) {
        errorMessages.push("Código de seguridad inválido. Debe tener 3 dígitos.");
    }

    // Mostrar errores si hay
    if (errorMessages.length > 0) {
        errorMessages.forEach(msg => {
            const p = document.createElement('p');
            p.textContent = msg;
            p.classList.add('error-message');
            messagesDiv.appendChild(p);
        });
        return;
    }

    // Simulación de respuesta del servidor
    let simulatedResponse = { success: true, message: "Pago autorizado." };

    // Mostrar resultado
    const p = document.createElement('p');
    p.textContent = simulatedResponse.message;
    p.classList.add(simulatedResponse.success ? 'success-message' : 'error-message');
    messagesDiv.appendChild(p);

    // Limpiar formulario tras el pago
    if (simulatedResponse.success) {
        setTimeout(() => {
            alert("Pago realizado exitosamente.");
            form.reset();
        }, 1500);
    }
});
});



