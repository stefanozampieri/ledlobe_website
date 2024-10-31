// Stripe Initialization
const stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc');

// Price ID mapping
const priceIdMap = {
    blue: {
        1: 'price_1Q4sOGDw0JoxpcCwr5X4kXYK',
        50: 'price_1QCqhfDw0JoxpcCw0ORGt3np',
        100: 'price_1QCqvlDw0JoxpcCwSUlFNJb2'
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

const batteriesPriceId = 'price_1QCqNWDw0JoxpcCwc2CY4mQR';

// Shopping Cart
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Event Listeners
cartIcon.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
checkoutButton.addEventListener('click', handleCheckout);

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productType = button.getAttribute('data-product');
        addToCart(productType);
    });
});

// Cart Functions
function openCart() {
    cartSidebar.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
}

function addToCart(productType) {
    let item;
    
    if (productType === 'ledlobe') {
        const color = document.getElementById('color-select').value;
        const quantitySelect = document.getElementById('quantity-select');
        const quantity = parseInt(quantitySelect.value);
        const unitPrice = parseFloat(quantitySelect.options[quantitySelect.selectedIndex].getAttribute('data-price'));
        
        item = {
            type: 'ledlobe',
            color: color,
            quantity: quantity,
            unitPrice: unitPrice,
            priceId: priceIdMap[color][quantity],
            totalPrice: quantity * unitPrice
        };
    } else if (productType === 'batteries') {
        const quantity = parseInt(document.getElementById('batteries-quantity').value);
        const unitPrice = 2.90;
        
        item = {
            type: 'batteries',
            quantity: quantity,
            unitPrice: unitPrice,
            priceId: batteriesPriceId,
            totalPrice: quantity * unitPrice
        };
    }

    cart.push(item);
    updateCartDisplay();
    openCart();
}

function updateCartDisplay() {
    // Update cart count
    cartCount.textContent = cart.length;

    // Clear current cart items
    cartItems.innerHTML = '';

    // Calculate total
    let total = 0;

    // Add each item to cart display
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        let itemHTML = '';
        if (item.type === 'ledlobe') {
            itemHTML = `
                <div class="item-details">
                    <h4>LED Lobe - ${item.color}</h4>
                    <p>${item.quantity} units × ${item.unitPrice} CHF</p>
                </div>
                <div class="item-price">
                    <span>${item.totalPrice.toFixed(2)} CHF</span>
                    <button onclick="removeFromCart(${index})" class="remove-item">&times;</button>
                </div>
            `;
        } else {
            itemHTML = `
                <div class="item-details">
                    <h4>Batteries CR1025</h4>
                    <p>${item.quantity} pairs × ${item.unitPrice} CHF</p>
                </div>
                <div class="item-price">
                    <span>${item.totalPrice.toFixed(2)} CHF</span>
                    <button onclick="removeFromCart(${index})" class="remove-item">&times;</button>
                </div>
            `;
        }

        cartItem.innerHTML = itemHTML;
        cartItems.appendChild(cartItem);
        total += item.totalPrice;
    });

    // Update total display
    cartTotal.textContent = `${total.toFixed(2)} CHF`;
    
    // Show/hide checkout button
    checkoutButton.style.display = cart.length > 0 ? 'block' : 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

async function handleCheckout() {
    // Prepare line items for Stripe
    const lineItems = cart.map(item => ({
        price: item.priceId,
        quantity: 1 // Since our price IDs already include the quantity
    }));

    try {
        const result = await stripe.redirectToCheckout({
            lineItems: lineItems,
            mode: 'payment',
            successUrl: 'https://ledlobe.com/success.html',
            cancelUrl: 'https://ledlobe.com/',
            shippingAddressCollection: {
                allowedCountries: ['US', 'CH', 'FR', 'DE']
            }
        });

        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your checkout. Please try again.');
    }
}

// Update total price displays when quantities change
document.getElementById('quantity-select').addEventListener('change', function() {
    const quantitySelect = this;
    const unitPrice = parseFloat(quantitySelect.options[quantitySelect.selectedIndex].getAttribute('data-price'));
    const quantity = parseInt(quantitySelect.value);
    document.getElementById('ledlobe-price-display').textContent = `${unitPrice} CHF per unit`;
});

document.getElementById('batteries-quantity').addEventListener('input', function() {
    const quantity = parseInt(this.value) || 0;
    const totalPrice = (quantity * 2.90).toFixed(2);
    document.getElementById('batteries-price-display').textContent = `2.90 CHF per unit`;
});

// Add some CSS for the cart items
const style = document.createElement('style');
style.textContent = `
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .item-details h4 {
        margin: 0;
        color: var(--text-light);
    }
    
    .item-details p {
        margin: 0.5rem 0 0 0;
        font-size: 0.9rem;
        color: var(--text);
    }
    
    .item-price {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: #ff4444;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.2rem 0.5rem;
    }
    
    .remove-item:hover {
        color: #ff0000;
    }
`;
document.head.appendChild(style);