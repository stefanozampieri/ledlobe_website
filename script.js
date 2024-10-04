// Initialize Stripe with your publishable key
var stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc'); // Replace with your actual publishable key

document.getElementById('buy-button').addEventListener('click', function() {
    // Get selected color
    var color = document.getElementById('color').value;
    var quantity = parseInt(document.getElementById('quantity').value);

    // Map each color to its corresponding Price ID
    var priceIdMap = {
        red: 'prod_QwlfehZSBWH1cf', // Replace with actual Price ID for Red
        blue: 'prod_QwlwwBZs1kltVf', // Replace with actual Price ID for Blue
        green: 'prod_QwltVqnxwEn9i3', // Replace with actual Price ID for Green
        yellow: 'prod_Qwlt2o3BflWb9x', // Replace with actual Price ID for Yellow
        pink: 'prod_Qwlgasjf1G0Xyp' // Replace with actual Price ID for Black
    };

    // Get the corresponding Price ID for the selected color
    var priceId = priceIdMap[color];

    // Redirect to Stripe Checkout
    stripe.redirectToCheckout({
        lineItems: [{
            price: priceId, // Use the price ID corresponding to the selected color
            quantity: quantity
        }],
        mode: 'payment',
        successUrl: 'https://ledlobe.com/success.html',
        cancelUrl: 'https://ledlobe.com/cancel.html',
    })
    .then(function (result) {
        if (result.error) {
            // Inform the user if there was an error
            alert(result.error.message);
        }
    });
});
