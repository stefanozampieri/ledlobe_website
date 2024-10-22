// Stripe Initialization
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Handle LED Lobe purchase
document.getElementById('ledlobe-buy-button').addEventListener('click', function() {
    var color = document.getElementById('color').value;
    var quantity = parseInt(document.getElementById('ledlobe-quantity').value);

    var priceIdMap = {
        red: 'price_1Q4rw9Dw0JoxpcCwRed', // Replace with actual Price ID for Red
        blue: 'price_1Q4rw9Dw0JoxpcCwBlue', // Replace with actual Price ID for Blue
        green: 'price_1Q4rw9Dw0JoxpcCwGreen', // Replace with actual Price ID for Green
        yellow: 'price_1Q4rw9Dw0JoxpcCwYellow', // Replace with actual Price ID for Yellow
        pink: 'price_1Q4rw9Dw0JoxpcCwPink'  // Replace with actual Price ID for Pink
    };

    var priceId = priceIdMap[color];

    stripe.redirectToCheckout({
        lineItems: [{
            price: priceId,
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

// Handle Batteries purchase
document.getElementById('batteries-buy-button').addEventListener('click', function() {
    var quantity = parseInt(document.getElementById('batteries-quantity').value);
    var batteriesPriceId = 'price_1Q4rw9Dw0JoxpcCwBatteries'; // Replace with actual Price ID for the batteries

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
