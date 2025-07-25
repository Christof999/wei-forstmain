// Allgemeine JavaScript-Funktionen für alle Seiten

document.addEventListener('DOMContentLoaded', function() {
    // Add the fade-in class to all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
    
    // Check which sections are visible on page load
    checkVisibility();
    
    // Check which sections are visible on scroll
    window.addEventListener('scroll', checkVisibility);
    
    function checkVisibility() {
        sections.forEach(section => {
            // Get section position relative to viewport
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            if (sectionTop < windowHeight * 0.85 && sectionBottom > 0) {
                section.classList.add('visible');
            }
        });
    }
    
    // Add active class to current navigation link
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(innerLink => {
                innerLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Set the current page link as active
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Lightbox-Funktionalität, falls vorhanden
    function openLightbox(imageSrc) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = imageSrc;
            lightbox.style.display = 'flex';
        }
    }
    
    function closeLightbox(event) {
        const lightbox = document.getElementById('lightbox');
        
        if (lightbox && event.target.id === 'lightbox') {
            lightbox.style.display = 'none';
        }
    }
    
    // Lightbox-Funktionen global verfügbar machen
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    
    // Alle Galerie-Bilder mit Lightbox-Funktion versehen
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            openLightbox(this.src);
        });
    });
    
    // Lightbox-Klick-Event hinzufügen, falls Lightbox vorhanden
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', closeLightbox);
    }
});
