// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Update the total price display when the quantity is selected for LED Lobe
document.getElementById('quantity-select').addEventListener('change', function() {
    updateLedLobeTotalPrice();
});

// Handle the color change for LED Lobe
document.getElementById('color-select').addEventListener('change', function() {
    updateLedLobeTotalPrice();
});

// Function to update the total price for LED Lobe
function updateLedLobeTotalPrice() {
    var selectedQuantity = parseInt(document.getElementById('quantity-select').value);
    var unitPrice = parseFloat(document.getElementById('quantity-select').options[document.getElementById('quantity-select').selectedIndex].getAttribute('data-price'));

    var totalPrice = (selectedQuantity * unitPrice).toFixed(2); // Calculate total price and round to 2 decimal places
    document.getElementById('ledlobe-price-display').innerText = `Total price: ${totalPrice} CHF`; // Update total price display
}

// Handle LED Lobe purchase
document.getElementById('ledlobe-buy-button').addEventListener('click', function() {
    var color = document.getElementById('color-select').value;
    var quantity = parseInt(document.getElementById('quantity-select').value);

    // Map each color to its corresponding Price ID in Stripe
    var priceIdMap = {
        red: 'price_1Q4rw9Dw0JoxpcCwRed', // Replace with actual Price ID for Red
        blue: 'price_1Q4rw9Dw0JoxpcCwBlue', // Replace with actual Price ID for Blue
        green: 'price_1Q4rw9Dw0JoxpcCwGreen', // Replace with actual Price ID for Green
        yellow: 'price_1Q4rw9Dw0JoxpcCwYellow', // Replace with actual Price ID for Yellow
        pink: 'price_1Q4rw9Dw0JoxpcCwPink'  // Replace with actual Price ID for Pink
    };

    var priceId = priceIdMap[color]; // Get the correct price ID for the selected color

    stripe.redirectToCheckout({
        lineItems: [{
            price: priceId, // Use the color-specific price ID
            quantity: quantity
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/cancel.html',
    })
    .then(function(result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
});


// Handle form submission prevention for batteries form
document.getElementById('batteries-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
});

// Update total price for Batteries when quantity is changed
document.getElementById('batteries-quantity').addEventListener('input', function() {
    updateBatteriesTotalPrice();
});

// Function to update the total price for Batteries
function updateBatteriesTotalPrice() {
    var unitPrice = 2.90; // Fixed unit price for batteries
    var quantity = parseInt(document.getElementById('batteries-quantity').value) || 0;
    var totalPrice = (quantity * unitPrice).toFixed(2); // Calculate total price and round to 2 decimal places
    document.getElementById('batteries-price-display').innerText = `Total price: ${totalPrice} CHF`; // Update total price display
}

// Handle Batteries purchase (fixed price per unit)
document.getElementById('batteries-buy-button').addEventListener('click', function() {
    var quantity = parseInt(document.getElementById('batteries-quantity').value);
    var batteriesPriceId = 'price_1Q4rw9Dw0JoxpcCwBatteries'; // Replace with actual price ID for the batteries

    stripe.redirectToCheckout({
        lineItems: [{
            price: batteriesPriceId,
            quantity: quantity
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/cancel.html',
    })
    .then(function(result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
});


