// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Update the price display when the quantity is selected for LED Lobe
document.getElementById('quantity-select').addEventListener('change', function() {
    var selectedOption = this.options[this.selectedIndex];
    var unitPrice = selectedOption.getAttribute('data-price');
    document.getElementById('ledlobe-price-display').innerText = `Unit price: ${unitPrice} CHF`;
});

// Handle LED Lobe purchase with quantity-based pricing
document.getElementById('ledlobe-buy-button').addEventListener('click', function() {
    var quantity = parseInt(document.getElementById('quantity-select').value);

    // Assume a single price ID for the LED Lobe product, handle quantity-based pricing with Stripe directly
    var ledlobePriceId = 'price_1Q4rw9Dw0JoxpcCwLedLobe'; // Replace with the actual price ID for LED Lobe

    stripe.redirectToCheckout({
        lineItems: [{
            price: ledlobePriceId, // Price ID remains the same, Stripe will charge based on quantity
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
