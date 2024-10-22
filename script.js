// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Update total price for LED Lobe
document.getElementById('quantity-select').addEventListener('change', function() {
    updateLedLobeTotalPrice();
});

document.getElementById('color-select').addEventListener('change', function() {
    updateLedLobeTotalPrice();
});

// Function to update total price for LED Lobe
function updateLedLobeTotalPrice() {
    var selectedQuantity = parseInt(document.getElementById('quantity-select').value);
    var unitPrice = parseFloat(document.getElementById('quantity-select').options[document.getElementById('quantity-select').selectedIndex].getAttribute('data-price'));

    var totalPrice = (selectedQuantity * unitPrice).toFixed(2); // Calculate total price
    document.getElementById('ledlobe-price-display').innerText = `Total price: ${totalPrice} CHF`; // Update price display
}

// Handle LED Lobe purchase
document.getElementById('ledlobe-buy-button').addEventListener('click', function() {
    var color = document.getElementById('color-select').value;
    var quantity = parseInt(document.getElementById('quantity-select').value);

            // Map each color to its corresponding Product ID in Stripe
            var priceIdMap = {
                blue: 'prod_QwlwwBZs1kltVf',   // Correct Price ID for Blue
                green: 'prod_QwltVqnxwEn9i3',  // Correct Price ID for Green
                yellow: 'prod_Qwlt2o3BflWb9x', // Correct Price ID for Yellow
                pink: 'prod_Qwlgasjf1G0Xyp',   // Correct Price ID for Pink
                red: 'prod_QwlfehZSBWH1cf'     // Correct Price ID for Red
            };


    var priceId = priceIdMap[color]; // Get the correct price ID based on color selection

    if (!priceId || quantity <= 0) {
        alert("Invalid quantity or color selection.");
        return;
    }

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

// Update total price for Batteries
document.getElementById('batteries-quantity').addEventListener('input', function() {
    updateBatteriesTotalPrice();
});

// Function to update total price for Batteries
function updateBatteriesTotalPrice() {
    var unitPrice = 2.90; // Fixed unit price for batteries
    var quantity = parseInt(document.getElementById('batteries-quantity').value) || 0;
    var totalPrice = (quantity * unitPrice).toFixed(2); // Calculate total price
    document.getElementById('batteries-price-display').innerText = `Total price: ${totalPrice} CHF`; // Update price display
}

// Handle Batteries purchase
document.getElementById('batteries-buy-button').addEventListener('click', function() {
    var quantity = parseInt(document.getElementById('batteries-quantity').value);

    if (quantity <= 0) {
        alert("Please enter a valid quantity for batteries.");
        return;
    }

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
