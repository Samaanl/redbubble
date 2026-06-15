import './style.css'
import products from './public/images/drooling-cat-products.json'

// Add basic scroll reveal effects
document.addEventListener("DOMContentLoaded", () => {
    console.log("GoofyShop loaded! GoatCounter is active.");

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to design cards
    const cards = document.querySelectorAll('.design-card');
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Image Rotator Logic
    const rotators = document.querySelectorAll('.image-rotator');
    rotators.forEach(rotator => {
        const images = rotator.querySelectorAll('.rotator-img');
        if (images.length <= 1) return; // No need to rotate if 0 or 1 image

        let currentIndex = 0;
        
        setInterval(() => {
            // Remove active class from current image
            images[currentIndex].classList.remove('active');
            
            // Increment index, loop back to 0 if at the end
            currentIndex = (currentIndex + 1) % images.length;
            
            // Add active class to new image
            images[currentIndex].classList.add('active');
        }, 3000); // Change image every 3 seconds
    });

    // Drooling Cat Focus & Scroll Logic
    const promoBanner = document.getElementById('droolingCatBanner');
    const targetCard = document.getElementById('drooling-cat');

    function triggerHighlightPulse(element) {
        element.classList.remove('highlight-pulse');
        // Force reflow to restart CSS animation
        void element.offsetWidth;
        element.classList.add('highlight-pulse');
    }

    if (promoBanner && targetCard) {
        promoBanner.addEventListener('click', () => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            triggerHighlightPulse(targetCard);
        });
    }

    // Scroll if hash is present
    if (window.location.hash === '#drooling-cat' && targetCard) {
        setTimeout(() => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            triggerHighlightPulse(targetCard);
        }, 500);
    } else if (targetCard) {
        // Otherwise, gently pulse the card on load to draw focus
        setTimeout(() => {
            triggerHighlightPulse(targetCard);
        }, 1200);
    }

    // Render Products Grid
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-item-card';
            
            // Set up transition delay for scroll reveal
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";
            card.style.transition = `all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.04}s`;
            
            // Convert title to a kebab-case event string for GoatCounter
            const eventName = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            card.innerHTML = `
                <div class="product-item-image-wrapper">
                    <img src="${product.image}" alt="${product.title}" class="product-item-image" loading="lazy" />
                </div>
                <div class="product-item-info">
                    <h4 class="product-item-title">${product.title}</h4>
                    <div class="product-item-price">${product.price}</div>
                    <a href="${product.link}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="product-item-btn"
                       data-goatcounter-click="drooling-cat-product-${eventName}"
                       data-goatcounter-title="Drooling Cat ${product.title} Click">
                       <i data-lucide="shopping-cart"></i> Buy Product
                    </a>
                </div>
            `;
            productsGrid.appendChild(card);
            observer.observe(card);
        });
        
        // Re-run lucide icons to parse new cards
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
});
