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

// Cart Functions
function openCart() {
    cartSidebar.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
}

function updateCart() {
    cartItems