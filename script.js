// Initialize Stripe with your publishable key
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

// Handle LED Lobe purchase
document.getElementById('ledlobe-buy-button').addEventListener('click', function() {
    var color = document.getElementById('color').value;
    var quantity = parseInt(document.getElementById('ledlobe-quantity').value);

    var priceIdMap = {
        red: 'prod_QwlfehZSBWH1cf', // Replace with actual Price ID for Red
        blue: 'prod_QwlwwBZs1kltVf', // Replace with actual Price ID for Blue
        green: 'prod_QwltVqnxwEn9i3', // Replace with actual Price ID for Green
        yellow: 'prod_Qwlt2o3BflWb9x', // Replace with actual Price ID for Yellow
        pink: 'prod_Qwlgasjf1G0Xyp'  // Replace with actual Price ID for Pink
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
    .then(function (result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
});

// Handle Batteries purchase
document.getElementById('batteries-buy-button').addEventListener('click', function() {
    var quantity = parseInt(document.getElementById('batteries-quantity').value);
    var batteriesPriceId = 'prod_XYZBatteriesPriceID'; // Replace with actual Price ID for the batteries

    stripe.redirectToCheckout({
        lineItems: [{
            price: batteriesPriceId,
            quantity: quantity
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/cancel.html',
    })
    .then(function (result) {
        if (result.error) {
            alert(result.error.message);
        }
    });
});
