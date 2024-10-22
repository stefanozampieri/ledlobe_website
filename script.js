// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Map each color and quantity to its corresponding Price ID in Stripe (for quantities 1, 50, and 100)
var priceIdMap = {
    blue: {
        1: 'price_1Q4sOGDw0JoxpcCwr5X4kXYK',    // Replace with actual Price ID for 1 unit of Blue
        50: 'price_1QCqhfDw0JoxpcCw0ORGt3np',  // Replace with actual Price ID for 50 units of Blue
        100: 'price_1QCqvlDw0JoxpcCwSUlFNJb2' // Replace with actual Price ID for 100 units of Blue
    },
    green: {
        1: 'price_1Q4sM2Dw0JoxpcCwrIOncYR2',
        50: 'price_1QCqkODw0JoxpcCwBjsStbRT',
        100: 'price_1QCqurDw0JoxpcCwWLxzGcdP'
    },
    yellow: {
        1: 'price_1Q4sLFDw0JoxpcCwuVCJlXr8',
        50: 'price_1QCqlIDw0JoxpcCwsrPP4SyA',
        100: 'price_1QCqtzDw0JoxpcCwran2c1F7'
    },
    pink: {
        1: 'price_1Q4s9CDw0JoxpcCwvxkPOdIS',
        50: 'price_1QCqnDDw0JoxpcCwD6wJGdbR',
        100: 'price_1QCqsoDw0JoxpcCwo9tDocTd'
    },
    red: {
        1: 'price_1Q4s8DDw0JoxpcCwMrjcqak4',
        50: 'price_1QCqooDw0JoxpcCwkgtaCNTH',
        100: 'price_1QCqrvDw0JoxpcCwY71nzGPZ'
    }
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

    var priceId = priceIdMap[color][quantity]; // Get the correct Price ID for the selected color and quantity

    if (!priceId || quantity <= 0) {
        alert("Invalid quantity or color selection.");
        return;
    }

    stripe.redirectToCheckout({
        lineItems: [{
            price: priceId, // Use the color and quantity-specific Price ID
            quantity: 1 // Set the quantity to 1 because the price is for the selected package
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/',
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
        cancelUrl: 'https://ledlobe.com/',
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
