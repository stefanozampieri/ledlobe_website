// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Map each color and quantity to its corresponding Price ID in Stripe
var priceIdMap = {
    blue: {
        1: 'price_1Q4sOGDw0JoxpcCwr5X4kXYK',    // Replace with actual Price ID for 1 unit of Blue
        10: 'price_1QCpo5Dw0JoxpcCwDCEDi6bc',  // Replace with actual Price ID for 10 units of Blue
        25: 'price_1QCpphDw0JoxpcCws8cFUoy6',  // Replace with actual Price ID for 25 units of Blue
        50: 'price_1QCpq5Dw0JoxpcCwTFRehqfe',  // Replace with actual Price ID for 50 units of Blue
        100: 'price_1QCpqZDw0JoxpcCwwDhQn4jG',// Replace with actual Price ID for 100 units of Blue
        1000: 'price_1QCpr0Dw0JoxpcCwEz2gn1Sz' // Replace with actual Price ID for 1000 units of Blue
    },
    green: {
        1: 'price_xxx_green_1',
        10: 'price_xxx_green_10',
        25: 'price_xxx_green_25',
        50: 'price_xxx_green_50',
        100: 'price_xxx_green_100',
        1000: 'price_xxx_green_1000'
    },
    yellow: {
        1: 'price_xxx_yellow_1',
        10: 'price_xxx_yellow_10',
        25: 'price_xxx_yellow_25',
        50: 'price_xxx_yellow_50',
        100: 'price_xxx_yellow_100',
        1000: 'price_xxx_yellow_1000'
    },
    pink: {
        1: 'price_xxx_pink_1',
        10: 'price_xxx_pink_10',
        25: 'price_xxx_pink_25',
        50: 'price_xxx_pink_50',
        100: 'price_xxx_pink_100',
        1000: 'price_xxx_pink_1000'
    },
    red: {
        1: 'price_xxx_red_1',
        10: 'price_xxx_red_10',
        25: 'price_xxx_red_25',
        50: 'price_xxx_red_50',
        100: 'price_xxx_red_100',
        1000: 'price_xxx_red_1000'
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
            quantity: 1 // Quantity is 1 because the Price ID already reflects the total price for that package
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
