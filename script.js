// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Update the price display when the quantity is selected
document.getElementById('quantity-select').addEventListener('change', function() {
    var selectedOption = this.options[this.selectedIndex];
    var unitPrice = selectedOption.getAttribute('data-price');
    document.getElementById('ledlobe-price-display').innerText = `Unit price: ${unitPrice} CHF`;
});

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
