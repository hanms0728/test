document.addEventListener('DOMContentLoaded', (event) => {
    const magicButton = document.getElementById('magicButton');
    
    magicButton.addEventListener('click', () => {
        alert('Magic!');
    });

    // Image gallery click event
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach(image => {
        image.addEventListener('click', (e) => {
            const src = e.target.src;
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.cursor = 'pointer';
            const img = document.createElement('img');
            img.src = src;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            modal.appendChild(img);
            document.body.appendChild(modal);
            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
    });

    // Contact form submit event
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        alert(`Name: ${name}\nMessage: ${message}`);
        contactForm.reset();
    });

    // Image slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slides');
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
    };
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    showSlide(currentSlide);
    setInterval(nextSlide, 3000); // Change slide every 3 seconds
});
