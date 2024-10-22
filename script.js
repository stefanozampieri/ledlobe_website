// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Map each color to its corresponding Price ID in Stripe
var priceIdMap = {
    blue: 'price_1Q4sOGDw0JoxpcCwr5X4kXYK',   // Correct Price ID for Blue
    green: 'price_1Q4sM2Dw0JoxpcCwrIOncYR2',  // Correct Price ID for Green
    yellow: 'price_1Q4sLFDw0JoxpcCwuVCJlXr8', // Correct Price ID for Yellow
    pink: 'price_1Q4s9CDw0JoxpcCwvxkPOdIS',   // Correct Price ID for Pink
    red: 'price_1Q4s8DDw0JoxpcCwMrjcqak4'     // Correct Price ID for Red
};

// Update total price for LED Lobe when quantity or color is selected
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

// Handle LED Lobe purchase with quantity-based pricing and shipping address collection
document.getElementById('ledlobe-buy-button').addEventListener('click', function() {
    var color = document.getElementById('color-select').value;
    var quantity = parseInt(document.getElementById('quantity-select').value);

    var priceId = priceIdMap[color]; // Get the correct Price ID for the selected color

    if (!priceId || quantity <= 0) {
        alert("Invalid quantity or color selection.");
        return;
    }

    stripe.redirectToCheckout({
        lineItems: [{
            price: priceId, // Use the color-specific Price ID
            quantity: quantity
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/cancel.html',
        shippingAddressCollection: {
            allowedCountries: ['US', 'CH', 'FR', 'DE'] // Specify the countries you ship to
        }
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

// Function to update total price for Batteries
function updateBatteriesTotalPrice() {
    var unitPrice = 2.90; // Fixed unit price for batteries
    var quantity = parseInt(document.getElementById('batteries-quantity').value) || 0;
    var totalPrice = (quantity * unitPrice).toFixed(2); // Calculate total price
    document.getElementById('batteries-price-display').innerText = `Total price: ${totalPrice} CHF`; // Update price display
}

// Handle Batteries purchase with shipping address collection
document.getElementById('batteries-buy-button').addEventListener('click', function() {
    var quantity = parseInt(document.getElementById('batteries-quantity').value);

    if (quantity <= 0) {
        alert("Please enter a valid quantity for batteries.");
        return;
    }

    var batteriesPriceId = 'price_1QCqNWDw0JoxpcCwc2CY4mQR'; // Replace with actual price ID for the batteries

    stripe.redirectToCheckout({
        lineItems: [{
            price: batteriesPriceId,
            quantity: quantity
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/cancel.html',
        shippingAddressCollection: {
            allowedCountries: ['US', 'CH', 'FR', 'DE'] // Specify the countries you ship to
        }
    })
    .then(function(result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
});
