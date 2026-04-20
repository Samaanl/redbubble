import './style.css'

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
});
