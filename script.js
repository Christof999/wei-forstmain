// Warten, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log("Startseite geladen");
  
    // 1. SLIDESHOW
    const slideshowImages = [
        "https://website-imageslw.s3.eu-central-1.amazonaws.com/gallery/Weiß_Forst_Gbr_055.JPG",
        "https://website-imageslw.s3.eu-central-1.amazonaws.com/gallery/Weiß_Forst_Gbr_048.JPG",
        "https://website-imageslw.s3.eu-central-1.amazonaws.com/gallery/Weiß_Forst_Gbr_030.JPG"
    ];
  
    let currentIndex = 0;
    const slideshowImageElement = document.getElementById("slideshow-image");
  
    // Funktion, um das erste Bild sofort zu laden
    function initializeSlideshow() {
        if (slideshowImageElement) {
            // Setze das erste Bild
            slideshowImageElement.src = slideshowImages[currentIndex];
            slideshowImageElement.classList.add("active");
        } else {
            console.error("Slideshow-Element nicht gefunden.");
        }
    }
  
    // Funktion, um das nächste Bild anzuzeigen
    function updateSlideshow() {
        if (slideshowImageElement) {
            slideshowImageElement.classList.remove("active");
  
            setTimeout(() => {
                const nextIndex = (currentIndex + 1) % slideshowImages.length;
                if (currentIndex !== nextIndex) {
                    currentIndex = nextIndex;
                    slideshowImageElement.src = slideshowImages[currentIndex];
                }
                slideshowImageElement.classList.add("active");
            }, 500); // Kurze Verzögerung für den Übergang
        }
    }
  
    // Initialisiere die Slideshow sofort
    initializeSlideshow();
  
    // Starte den Intervall für den Bildwechsel
    setInterval(updateSlideshow, 5000);
    
    // 2. ADMIN POSTS GALLERY
    // API URL für Posts (muss mit der aus admin_posts.js übereinstimmen)
    const API_BASE_URL = "https://ilxyp19ev8.execute-api.eu-central-1.amazonaws.com/test1";
    const postsGalleryElement = document.getElementById("posts-gallery");
    
    // Funktion zum Abrufen der Posts von AWS
    async function fetchPosts() {
        try {
            console.log("Lade Posts für die Startseite...");
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Fehler ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            let posts;
            if (data && typeof data.body === 'string') {
                posts = JSON.parse(data.body);
            } else {
                posts = data;
            }
            
            return Array.isArray(posts) ? posts : [];
        } catch (error) {
            console.error("Fehler beim Laden der Beiträge:", error);
            return [];
        }
    }
    
    // Funktion zum Formatieren des Datums
    function formatPostDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Globales Array für alle Posts (für Navigation im Modal)
    let allPosts = [];
    let currentPostIndex = 0;
    
    // Funktion zum Anzeigen der Posts in der Swiper Gallery
    async function displayPostsInGallery() {
        if (!postsGalleryElement) return;
        
        try {
            const posts = await fetchPosts();
            allPosts = posts; // Speichere Posts global
            
            // Entferne den Ladeindikator
            postsGalleryElement.innerHTML = "";
            
            if (posts.length === 0) {
                // Zeige Nachricht, wenn keine Posts verfügbar sind
                const noPostsSlide = document.createElement('div');
                noPostsSlide.className = 'swiper-slide no-posts';
                noPostsSlide.innerHTML = `
                    <div class="post-content">
                        <h3>Keine Beiträge verfügbar</h3>
                        <p>Schauen Sie später wieder vorbei für Neuigkeiten.</p>
                    </div>
                `;
                postsGalleryElement.appendChild(noPostsSlide);
                // Initialisiere Swiper auch ohne Posts
                initSwiperGallery(0);
            } else {
                // Zeige die Posts in der Gallery an
                posts.forEach((post, index) => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    
                    const dateStr = formatPostDate(post.timestamp);
                    const truncatedText = post.text.length > 120 ? post.text.substring(0, 120) + '...' : post.text;
                    
                    slide.innerHTML = `
                        <div class="post-card" data-post-index="${index}">
                            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}
                            <div class="post-content">
                                <h3>${post.title}</h3>
                                ${dateStr ? `<div class="post-date">${dateStr}</div>` : ''}
                                <p>${truncatedText}</p>
                                <button class="read-more-btn">Weiterlesen</button>
                            </div>
                        </div>
                    `;
                    
                    // Event Listener für das Öffnen des Modals
                    const postCard = slide.querySelector('.post-card');
                    const readMoreBtn = slide.querySelector('.read-more-btn');
                    
                    const openModal = (e) => {
                        e.stopPropagation();
                        currentPostIndex = index;
                        openPostModal(post, index);
                    };
                    
                    postCard.addEventListener('click', openModal);
                    readMoreBtn.addEventListener('click', openModal);
                    
                    postsGalleryElement.appendChild(slide);
                });
                
                // Initialisiere die Swiper Gallery mit Posts
                initSwiperGallery(posts.length);
            }
            
        } catch (error) {
            console.error("Fehler beim Anzeigen der Beiträge:", error);
            postsGalleryElement.innerHTML = `
                <div class="swiper-slide error">
                    <div class="post-content">
                        <h3>Fehler beim Laden</h3>
                        <p>Die Beiträge konnten nicht geladen werden.</p>
                    </div>
                </div>
            `;
            // Initialisiere Swiper auch bei Fehler
            initSwiperGallery(0);
        }
    }
    
    // Swiper-Instanz initialisieren
    function initSwiperGallery(postCount = 1) {
        // Loop nur aktivieren, wenn genügend Posts vorhanden sind
        const enableLoop = postCount > 2;
        
        new Swiper('.swiper-container', {
            // Grundkonfiguration für bessere Zentrierung
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: enableLoop,
            centeredSlides: true,
            
            // Verbesserte Autoplay-Konfiguration (nur wenn genügend Posts)
            autoplay: enableLoop ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: false,
            } : false,
            
            // Navigation und Pagination (nur wenn Loop aktiviert)
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: enableLoop ? {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            } : false,
            
            // Sanfte Übergänge
            effect: 'slide',
            speed: 800,
            
            // Touch- und Maus-Interaktionen vereinfachen
            allowTouchMove: true,
            simulateTouch: true,
            touchRatio: 1,
            threshold: 5,
            
            // Mousewheel deaktiviert für normales Seiten-Scrollen
            mousewheel: false,
            
            // Responsive Breakpoints mit konstanter Zentrierung
            breakpoints: {
                // Sehr kleine Bildschirme
                320: {
                    slidesPerView: 'auto',
                    spaceBetween: 15,
                    centeredSlides: true,
                },
                // Kleine Bildschirme
                480: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    centeredSlides: true,
                },
                // Mittlere Bildschirme
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 25,
                    centeredSlides: true,
                },
                // Große Bildschirme
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: true,
                },
                // Extra große Bildschirme
                1200: {
                    slidesPerView: 'auto',
                    spaceBetween: 35,
                    centeredSlides: true,
                },
                // Vollbild-Desktop
                1600: {
                    slidesPerView: 'auto',
                    spaceBetween: 40,
                    centeredSlides: true,
                },
            },
            
            // Event-Handler für bessere Kontrolle
            on: {
                init: function() {
                    // Stelle sicher, dass der erste Slide zentriert ist
                    this.slideTo(0, 0);
                },
                autoplayStart: function() {
                    console.log('Autoplay gestartet');
                },
                slideChange: function() {
                    // Sorge für glatte Übergänge
                    this.update();
                }
            }
        });
    }
    
    // Lade und zeige die Posts an
    displayPostsInGallery();
  
    // 3. DROPDOWN-FUNKTIONALITÄT
    const dropdownToggle = document.querySelector('.dropdown .dropbtn');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Verhindere das Standardverhalten des Links
            const dropdownContent = this.nextElementSibling;
            dropdownContent.classList.toggle('show');
        });
    }
  
    // Schließe das Dropdown-Menü, wenn außerhalb geklickt wird
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            const openDropdown = document.querySelector('.dropdown-content.show');
            if (openDropdown) {
                openDropdown.classList.remove('show');
            }
        }
    });
  
    // 4. LIGHTBOX-FUNKTIONEN
    window.openLightbox = function(imgSrc) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = imgSrc;
            lightbox.style.display = 'flex';
            
            // Verhindert Scrollen im Hintergrund
            // Wenn Modal offen ist, nicht überschreiben
            const modal = document.getElementById('postModal');
            if (!modal || !modal.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            }
            
            // Setze Fokus auf die Lightbox, um Tastaturnavigation zu ermöglichen
            lightbox.focus();
            
            // Event-Listener für Escape-Taste hinzufügen
            document.addEventListener('keydown', handleLightboxKeydown);
        }
    };

    window.closeLightbox = function(event) {
        // Schließen kann entweder durch Event oder direkt aufgerufen werden
        if (!event || event.target.id === 'lightbox' || event.target.classList.contains('close-lightbox')) {
            const lightbox = document.getElementById('lightbox');
            if (lightbox) {
                lightbox.style.display = 'none';
                
                // Scrollen nur wieder aktivieren, wenn kein Modal offen ist
                const modal = document.getElementById('postModal');
                if (!modal || !modal.classList.contains('active')) {
                    document.body.style.overflow = '';
                }
                
                // Event-Listener für Escape-Taste entfernen
                document.removeEventListener('keydown', handleLightboxKeydown);
                
                // Fokus zurück auf das Element setzen, das die Lightbox geöffnet hat
                if (window.lastFocusedElement) {
                    window.lastFocusedElement.focus();
                }
            }
        }
    };

    // Funktion zur Behandlung von Tastatureingaben in der Lightbox
    function handleLightboxKeydown(event) {
        if (event.key === 'Escape') {
            window.closeLightbox({ target: { id: 'lightbox' } });
        }
    }

    // Speichert das Element, das vor dem Öffnen der Lightbox fokussiert war
    document.addEventListener('click', function(event) {
        if (event.target.closest('.img-wrapper') || 
            (event.target.tagName === 'IMG' && event.target.onclick && event.target.onclick.toString().includes('openLightbox'))) {
            window.lastFocusedElement = event.target;
        }
    });

    // Sorgt dafür, dass der Fokus in der Lightbox bleibt (Fokus-Trap)
    document.addEventListener('keydown', function(event) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.style.display === 'flex' && event.key === 'Tab') {
            const focusableElements = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
            
            if (focusableElements.length === 1) {
                event.preventDefault();
                focusableElements[0].focus();
            }
        }
    });

    // Navigation Highlight für aktive Seite
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    // Mobile Menü Setup
    function setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navbar = document.querySelector('.navbar');
        const overlay = document.querySelector('.menu-overlay');
        
        if (menuToggle) {
            // Toggle Menü bei Klick auf das Hamburger-Icon
            menuToggle.addEventListener('click', function() {
                menuToggle.classList.toggle('active');
                navbar.classList.toggle('active');
                overlay.classList.toggle('active');
                
                // Scroll verhindern, wenn Menü geöffnet ist
                if (navbar.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Menü schließen, wenn auf den Overlay geklickt wird
            overlay.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            // Menü schließen, wenn auf einen Link geklickt wird
            const navLinks = document.querySelectorAll('.navbar a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    menuToggle.classList.remove('active');
                    navbar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    // Verbesserte Smooth Scrolling Funktion
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Verbesserte Scroll-Animationen mit Intersection Observer
    function setupScrollAnimations() {
        // Elemente die animiert werden sollen
        const sections = document.querySelectorAll('section');
        const serviceItems = document.querySelectorAll('.service-item');
        const adminPostsGallery = document.querySelector('.admin-posts-gallery');
        const heroSection = document.querySelector('.hero-section');
        
        // Intersection Observer für bessere Performance
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Verzögerung für gestaffelten Effekt
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        // Sections beobachten
        sections.forEach(section => {
            if (!section.classList.contains('hero-section')) {
                section.classList.add('fade-in-up');
                observer.observe(section);
            }
        });
        
        // Service Items einzeln animieren
        serviceItems.forEach((item, index) => {
            item.classList.add('fade-in-scale');
            setTimeout(() => {
                observer.observe(item);
            }, index * 50);
        });
        
        // Hero Section sofort sichtbar
        if (heroSection) {
            heroSection.classList.add('visible');
        }
    }
    
    // Parallax-Effekt für Header-Video
    function setupParallaxEffect() {
        const video = document.querySelector('.video-container video');
        
        if (video) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                video.style.transform = `translateY(${parallax}px) translateZ(0)`;
            });
        }
    }
    
    highlightCurrentPage();
    setupMobileMenu();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupParallaxEffect();
    
    // 5. POST MODAL FUNKTIONALITÄT
    function openPostModal(post, index) {
        const modal = document.getElementById('postModal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalText = document.getElementById('modal-text');
        const prevBtn = document.querySelector('.post-modal-prev');
        const nextBtn = document.querySelector('.post-modal-next');
        
        if (!modal) return;
        
        currentPostIndex = index !== undefined ? index : currentPostIndex;
        
        // Setze die Modal-Inhalte
        const imageContainer = document.querySelector('.post-modal-image-container');
        if (post.imageUrl && modalImage && imageContainer) {
            modalImage.src = post.imageUrl;
            modalImage.alt = post.title;
            imageContainer.style.display = 'block';
            
            // Event-Listener für Bild-Zoom
            imageContainer.onclick = function() {
                openLightbox(post.imageUrl);
            };
        } else if (imageContainer) {
            imageContainer.style.display = 'none';
        }
        
        if (modalTitle) modalTitle.textContent = post.title || 'Kein Titel';
        
        // Formatiere das Datum falls vorhanden
        if (modalDate && post.timestamp) {
            const formattedDate = formatPostDate(post.timestamp);
            modalDate.textContent = formattedDate;
        } else if (modalDate) {
            modalDate.textContent = '';
        }
        
        if (modalText) modalText.textContent = post.text || 'Kein Inhalt verfügbar';
        
        // Update Navigation Buttons
        if (prevBtn) {
            prevBtn.disabled = currentPostIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPostIndex === allPosts.length - 1;
        }
        
        // Zeige das Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Fokus auf das Modal setzen
        modal.focus();
        
        // Event-Listener für Escape-Taste
        document.addEventListener('keydown', handleModalKeydown);
        
        // Setup Touch-Events für Swipe-to-Close auf Mobile
        setupModalSwipe();
    }
    
    function closePostModal() {
        const modal = document.getElementById('postModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Event-Listener für Escape-Taste entfernen
        document.removeEventListener('keydown', handleModalKeydown);
        
        // Touch-Events entfernen
        cleanupModalSwipe();
    }
    
    function handleModalKeydown(event) {
        if (event.key === 'Escape') {
            closePostModal();
        } else if (event.key === 'ArrowLeft') {
            navigateToPreviousPost();
        } else if (event.key === 'ArrowRight') {
            navigateToNextPost();
        }
    }
    
    function navigateToPreviousPost() {
        if (currentPostIndex > 0) {
            currentPostIndex--;
            openPostModal(allPosts[currentPostIndex], currentPostIndex);
        }
    }
    
    function navigateToNextPost() {
        if (currentPostIndex < allPosts.length - 1) {
            currentPostIndex++;
            openPostModal(allPosts[currentPostIndex], currentPostIndex);
        }
    }
    
    // Swipe-to-Close für Mobile
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isSwiping = false;
    
    function setupModalSwipe() {
        const modalContent = document.querySelector('.post-modal-content');
        if (!modalContent) return;
        
        modalContent.addEventListener('touchstart', handleTouchStart, { passive: true });
        modalContent.addEventListener('touchmove', handleTouchMove, { passive: false });
        modalContent.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    function cleanupModalSwipe() {
        const modalContent = document.querySelector('.post-modal-content');
        if (!modalContent) return;
        
        modalContent.removeEventListener('touchstart', handleTouchStart);
        modalContent.removeEventListener('touchmove', handleTouchMove);
        modalContent.removeEventListener('touchend', handleTouchEnd);
    }
    
    function handleTouchStart(e) {
        // Nur wenn am oberen Rand des Modal-Body gescrollt wird
        const modalBody = document.querySelector('.post-modal-body');
        if (modalBody && modalBody.scrollTop > 10) return;
        
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
    }
    
    function handleTouchMove(e) {
        if (touchStartY === 0) return;
        
        touchCurrentY = e.touches[0].clientY;
        const diff = touchCurrentY - touchStartY;
        
        // Nur nach unten swipen erlauben
        if (diff > 10) {
            isSwiping = true;
            const modalContent = document.querySelector('.post-modal-content');
            if (modalContent) {
                modalContent.classList.add('swiping');
                // Bewege das Modal mit dem Finger
                const translateY = Math.min(diff, 300);
                modalContent.style.transform = `translateY(${translateY}px)`;
                
                // Reduziere Opacity beim Swipen
                const opacity = Math.max(0, 1 - (diff / 400));
                document.querySelector('.post-modal-overlay').style.opacity = opacity;
            }
            
            // Verhindere Scrollen beim Swipen
            e.preventDefault();
        }
    }
    
    function handleTouchEnd(e) {
        if (!isSwiping) {
            touchStartY = 0;
            return;
        }
        
        const diff = touchCurrentY - touchStartY;
        const modalContent = document.querySelector('.post-modal-content');
        
        if (diff > 150) {
            // Schwellwert überschritten - schließe Modal
            closePostModal();
        } else {
            // Schwellwert nicht erreicht - zurück zur Ausgangsposition
            if (modalContent) {
                modalContent.style.transform = '';
                document.querySelector('.post-modal-overlay').style.opacity = '';
            }
        }
        
        if (modalContent) {
            modalContent.classList.remove('swiping');
        }
        
        touchStartY = 0;
        touchCurrentY = 0;
        isSwiping = false;
    }
    
    // Event-Listener für Modal-Schließen-Button
    const modalCloseBtn = document.querySelector('.post-modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closePostModal);
    }
    
    // Event-Listener für Klick auf Overlay
    const modalOverlay = document.querySelector('.post-modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closePostModal);
    }
    
    // Event-Listener für Navigation-Buttons
    const prevBtn = document.querySelector('.post-modal-prev');
    const nextBtn = document.querySelector('.post-modal-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', navigateToPreviousPost);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', navigateToNextPost);
    }
    
    // Globale Funktionen für Event-Handler
    window.openPostModal = openPostModal;
    window.closePostModal = closePostModal;
    window.navigateToPreviousPost = navigateToPreviousPost;
    window.navigateToNextPost = navigateToNextPost;
});