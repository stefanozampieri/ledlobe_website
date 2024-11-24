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

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cart open/close listeners
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Add to cart listeners for both products
    const ledlobeAddButton = document.querySelector('[data-product="ledlobe"]');
    const batteriesAddButton = document.querySelector('[data-product="batteries"]');

    if (ledlobeAddButton) {
        ledlobeAddButton.addEventListener('click', () => addToCart('ledlobe'));
    }

    if (batteriesAddButton) {
        batteriesAddButton.addEventListener('click', () => addToCart('batteries'));
    }

    // Checkout button listener
    checkoutButton.addEventListener('click', handleCheckout);

    // Initialize cart display
    updateCartDisplay();
});

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
            totalPrice: quantity * unitPrice,
            displayName: `LED Lobe (${color}, ${quantity} units)`
        };
    } else if (productType === 'batteries') {
        const quantity = parseInt(document.getElementById('batteries-quantity').value);
        const unitPrice = 2.90;
        
        item = {
            type: 'batteries',
            quantity: quantity,
            unitPrice: unitPrice,
            priceId: batteriesPriceId,
            totalPrice: quantity * unitPrice,
            displayName: `Batteries (${quantity} pairs)`
        };
    }

    if (item) {
        cart.push(item);
        updateCartDisplay();
        cartSidebar.classList.add('active'); // Show cart after adding item
    }
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

        cartItem.innerHTML = `
            <div class="item-details">
                <h4>${item.displayName}</h4>
                <p>${item.quantity} × ${item.unitPrice.toFixed(2)} CHF</p>
            </div>
            <div class="item-price">
                <span>${item.totalPrice.toFixed(2)} CHF</span>
                <button class="remove-item" data-index="${index}">&times;</button>
            </div>
        `;

        // Add remove button listener
        cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(index));

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
    const lineItems = cart.map(item => {
        return {
            price: item.priceId,
            quantity: 1 // Since our price IDs already include the quantity
        };
    });

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

// Add some additional styles dynamically
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

// Initialize product price displays
document.addEventListener('DOMContentLoaded', () => {
    // Update LED Lobe price display
    const quantitySelect = document.getElementById('quantity-select');
    if (quantitySelect) {
        quantitySelect.addEventListener('change', () => {
            const price = quantitySelect.options[quantitySelect.selectedIndex].getAttribute('data-price');
            document.getElementById('ledlobe-price-display').textContent = `${price} CHF per box containing a pair`;
        });
    }

    // Update Batteries price display
    const batteriesQuantity = document.getElementById('batteries-quantity');
    if (batteriesQuantity) {
        batteriesQuantity.addEventListener('input', () => {
            const quantity = parseInt(batteriesQuantity.value) || 0;
            document.getElementById('batteries-price-display').textContent = `2.90 CHF per pair`;
        });
    }
});

// Add this to your script.js file

function initializeCarousel(productId, images) {
    const productCard = document.getElementById(productId);
    if (!productCard) {
        console.error(`Product card with id ${productId} not found`);
        return;
    }

    const productImage = productCard.querySelector('.product-image');
    if (!productImage) {
        console.error(`Product image container not found in ${productId}`);
        return;
    }

    console.log(`Initializing carousel for ${productId} with images:`, images);

    // Create carousel HTML structure
    productImage.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-track"></div>
            ${images.length > 1 ? `
                <button class="carousel-button prev" aria-label="Previous image">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-button next" aria-label="Next image">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="carousel-dots"></div>
            ` : ''}
        </div>
    `;

    const track = productImage.querySelector('.carousel-track');
    const dotsContainer = productImage.querySelector('.carousel-dots');
    
    // Add images to track
    images.forEach((imgSrc, index) => {
        console.log(`Adding image ${index + 1}:`, imgSrc);
        
        // Add image slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${imgSrc}" alt="Product view ${index + 1}" onerror="console.error('Failed to load image:', this.src)">`;
        track.appendChild(slide);

        // Add dot indicator only if multiple images
        if (images.length > 1) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to image ${index + 1}`);
            dotsContainer.appendChild(dot);
        }
    });

    let currentSlide = 0;
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = dotsContainer?.querySelectorAll('.carousel-dot') || [];
    
    console.log(`Found ${slides.length} slides and ${dots.length} dots`);

    // Initialize first slide
    slides[0].classList.add('active');
    if (dots.length > 0) {
        dots[0].classList.add('active');
    }

    // Only set up navigation if there are multiple images
    if (images.length > 1) {
        const prevButton = productImage.querySelector('.carousel-button.prev');
        const nextButton = productImage.querySelector('.carousel-button.next');

        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });

        // Add dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        // Add swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        productImage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        productImage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    // Swipe left - next slide
                    currentSlide = (currentSlide + 1) % slides.length;
                } else {
                    // Swipe right - previous slide
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                }
                updateCarousel();
            }
        }
    }

    function updateCarousel() {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing carousels...');
    
    // Initialize LED Lobe carousel with multiple images
    initializeCarousel('ledlobe', [
        'ledlobe-images/Cropped_LEDLOBE_FIVEPACK.png',
        'ledlobe-images/cropped_LEDLOBE_RED.png'
    ]);

    // Initialize Batteries carousel
    initializeCarousel('batteries', [
        'battery-images/BATTERY_SINGLEPACK.jpg'
    ]);
});