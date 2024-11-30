// Stripe Initialization
const stripe = Stripe('pk_live_51Q4rw9Dw0JoxpcCwqnOoopUNUXpy6bLBRVMG6nzUCRnBiKfa3fRgx5ytH5WiWnDM8LIGoLwKT4CMPORpSDptIGcl0091WSgZFc');

// Price ID mapping - separate consumer and wholesale
const priceIdMap = {
    consumer: {
        blue: 'price_1Q4sOGDw0JoxpcCwr5X4kXYK',
        green: 'price_1Q4sM2Dw0JoxpcCwrIOncYR2',
        yellow: 'price_1Q4sLFDw0JoxpcCwuVCJlXr8',
        pink: 'price_1Q4s9CDw0JoxpcCwvxkPOdIS',
        red: 'price_1Q4s8DDw0JoxpcCwMrjcqak4'
    },
    wholesale: {
        blue: {
            50: 'price_1QCqhfDw0JoxpcCw0ORGt3np',
            100: 'price_1QCqvlDw0JoxpcCwSUlFNJb2'
        },
        green: {
            50: 'price_1QCqkODw0JoxpcCwBjsStbRT',
            100: 'price_1QCqurDw0JoxpcCwWLxzGcdP'
        },
        yellow: {
            50: 'price_1QCqlIDw0JoxpcCwsrPP4SyA',
            100: 'price_1QCqtzDw0JoxpcCwran2c1F7'
        },
        pink: {
            50: 'price_1QCqnDDw0JoxpcCwD6wJGdbR',
            100: 'price_1QCqsoDw0JoxpcCwo9tDocTd'
        },
        red: {
            50: 'price_1QCqooDw0JoxpcCwkgtaCNTH',
            100: 'price_1QCqrvDw0JoxpcCwY71nzGPZ'
        }
    }
};

const batteriesPriceId = 'price_1QCqNWDw0JoxpcCwc2CY4mQR';

// Shopping Cart
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('ledlobeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('ledlobeCart', JSON.stringify(cart));
}

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// Update event listeners for the new buttons
// Update event listeners for the new buttons
document.addEventListener('DOMContentLoaded', () => {
    // Load saved cart first
    loadCart();

    // Cart open/close listeners
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Add to cart listeners for all products
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productType = button.getAttribute('data-product');
            addToCart(productType);
        });
    });

    // Checkout button listener
    checkoutButton.addEventListener('click', handleCheckout);

    // Initialize cart display with loaded data
    updateCartDisplay();
});

function addToCart(productType) {
    let item;
    const isWholesale = productType.includes('wholesale');
    const section = isWholesale ? 'wholesale' : 'consumer';
    
    if (productType.includes('ledlobe')) {
        // Handle LED Lobe products
        if (isWholesale) {
            // Wholesale section - uses select with predefined quantities
            const colorSelect = document.getElementById(`color-select-${section}`);
            const quantitySelect = document.getElementById(`quantity-select-${section}`);
            
            if (!colorSelect || !quantitySelect) {
                console.error('Could not find wholesale form elements');
                return;
            }
            
            const color = colorSelect.value;
            const quantity = parseInt(quantitySelect.value);
            const unitPrice = parseFloat(quantitySelect.options[quantitySelect.selectedIndex].getAttribute('data-price'));
            
            item = {
                type: 'ledlobe-wholesale',
                color: color,
                quantity: quantity,
                unitPrice: unitPrice,
                priceId: priceIdMap.wholesale[color][quantity],
                totalPrice: quantity * unitPrice,
                displayName: `LED Lobe Wholesale (${color}, ${quantity} units)`
            };
        } else {
            // Consumer section - uses number input for quantity
            const colorSelect = document.getElementById(`color-select-${section}`);
            const quantityInput = document.getElementById(`quantity-${section}`);
            
            if (!colorSelect || !quantityInput) {
                console.error('Could not find consumer form elements');
                return;
            }
            
            const color = colorSelect.value;
            const quantity = parseInt(quantityInput.value);
            const unitPrice = 24.90; // Fixed price for consumer
            
            item = {
                type: 'ledlobe-consumer',
                color: color,
                quantity: quantity,
                unitPrice: unitPrice,
                priceId: priceIdMap.consumer[color],
                totalPrice: quantity * unitPrice,
                displayName: `LED Lobe (${color}, ${quantity} unit${quantity > 1 ? 's' : ''})`
            };
        }
    } else if (productType.includes('batteries')) {
        // Handle battery products
        const quantityInput = document.getElementById(`batteries-quantity-${section}`);
        
        if (!quantityInput) {
            console.error('Could not find batteries quantity input');
            return;
        }
        
        const quantity = parseInt(quantityInput.value);
        const unitPrice = 2.90;
        
        item = {
            type: `batteries-${section}`,
            quantity: quantity,
            unitPrice: unitPrice,
            priceId: batteriesPriceId,
            totalPrice: quantity * unitPrice,
            displayName: `Batteries (${quantity} pair${quantity > 1 ? 's' : ''})`
        };
    }
 
    if (item) {
        cart.push(item);
        saveCart(); // Save cart to localStorage
        updateCartDisplay();
        cartSidebar.classList.add('active');
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

// Update removeFromCart function
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart(); // Save after removing
    updateCartDisplay();
}

async function handleCheckout() {
    const lineItems = cart.map(item => {
        if (item.type === 'ledlobe-wholesale') {  // Only LED earrings wholesale
            // Wholesale LEDs - quantity is included in the price ID
            return {
                price: item.priceId,
                quantity: 1
            };
        } else {
            // All other items (consumer LEDs, consumer batteries, wholesale batteries)
            return {
                price: item.priceId,
                quantity: item.quantity
            };
        }
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
    // Update wholesale LED Lobe price display
    const wholesaleQuantitySelect = document.getElementById('quantity-select-wholesale');
    if (wholesaleQuantitySelect) {
        wholesaleQuantitySelect.addEventListener('change', () => {
            const price = wholesaleQuantitySelect.options[wholesaleQuantitySelect.selectedIndex].getAttribute('data-price');
            document.getElementById('ledlobe-price-display-wholesale').textContent = `${price} CHF per box`;
        });
        // Set initial price
        const initialPrice = wholesaleQuantitySelect.options[wholesaleQuantitySelect.selectedIndex].getAttribute('data-price');
        document.getElementById('ledlobe-price-display-wholesale').textContent = `${initialPrice} CHF per box`;
    }

    // Update consumer LED Lobe price display (fixed price)
    const consumerPriceDisplay = document.getElementById('ledlobe-price-display-consumer');
    if (consumerPriceDisplay) {
        consumerPriceDisplay.textContent = '24.90 CHF per box';
    }

    // Update consumer Batteries price display
    const batteriesQuantityConsumer = document.getElementById('batteries-quantity-consumer');
    if (batteriesQuantityConsumer) {
        batteriesQuantityConsumer.addEventListener('input', () => {
            document.getElementById('batteries-price-display-consumer').textContent = '2.90 CHF per pair';
        });
    }

    // Update wholesale Batteries price display
    const batteriesQuantityWholesale = document.getElementById('batteries-quantity-wholesale');
    if (batteriesQuantityWholesale) {
        batteriesQuantityWholesale.addEventListener('input', () => {
            document.getElementById('batteries-price-display-wholesale').textContent = '2.90 CHF per pair';
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
// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Price display updates - only run on pages with these elements
    const wholesaleQuantitySelect = document.getElementById('quantity-select-wholesale');
    if (wholesaleQuantitySelect) {
        wholesaleQuantitySelect.addEventListener('change', () => {
            const price = wholesaleQuantitySelect.options[wholesaleQuantitySelect.selectedIndex].getAttribute('data-price');
            const priceDisplay = document.getElementById('ledlobe-price-display-wholesale');
            if (priceDisplay) {
                priceDisplay.textContent = `${price} CHF per box`;
            }
        });
        
        // Set initial price
        const initialPrice = wholesaleQuantitySelect.options[wholesaleQuantitySelect.selectedIndex].getAttribute('data-price');
        const initialPriceDisplay = document.getElementById('ledlobe-price-display-wholesale');
        if (initialPriceDisplay) {
            initialPriceDisplay.textContent = `${initialPrice} CHF per box`;
        }
    }

    // Consumer price displays - only when elements exist
    const consumerPriceDisplay = document.getElementById('ledlobe-price-display-consumer');
    if (consumerPriceDisplay) {
        consumerPriceDisplay.textContent = '24.90 CHF per box';
    }

    // Initialize carousels based on page
    if (document.getElementById('hero-carousel')) {
        const heroImages = [
            'main_image.png',
            'ledlobe-images/IMG_5862.jpg',
            'ledlobe-images/IMG_5863.jpg',
            'ledlobe-images/IMG_5864.jpg'
        ];
        initializeCarousel('hero-carousel', heroImages);
    }

    // Consumer products carousel
    if (document.getElementById('ledlobe-consumer')) {
        const ledlobeImages = [
            'ledlobe-images/IMG_5862.jpg',
            'ledlobe-images/IMG_5863.jpg',
            'ledlobe-images/IMG_5864.jpg',
            'ledlobe-images/IMG_5865.jpg',
            'ledlobe-images/IMG_5866.jpg',
            'ledlobe-images/IMG_5867.jpg'
        ];
        initializeCarousel('ledlobe-consumer', ledlobeImages);
    }

    // Wholesale products carousel
    if (document.getElementById('ledlobe-wholesale')) {
        const ledlobeImages = [
            'ledlobe-images/IMG_5862.jpg',
            'ledlobe-images/IMG_5863.jpg',
            'ledlobe-images/IMG_5864.jpg',
            'ledlobe-images/IMG_5865.jpg',
            'ledlobe-images/IMG_5866.jpg',
            'ledlobe-images/IMG_5867.jpg'
        ];
        initializeCarousel('ledlobe-wholesale', ledlobeImages);
    }

    // Battery carousels
    const batteryImages = ['battery-images/battery_pair.png'];
    
    if (document.getElementById('batteries-consumer')) {
        initializeCarousel('batteries-consumer', batteryImages);
    }
    
    if (document.getElementById('batteries-wholesale')) {
        initializeCarousel('batteries-wholesale', batteryImages);
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
        }
    });
});