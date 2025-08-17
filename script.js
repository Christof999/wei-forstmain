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
    
    // Funktion zum Anzeigen der Posts in der Swiper Gallery
    async function displayPostsInGallery() {
        if (!postsGalleryElement) return;
        
        try {
            const posts = await fetchPosts();
            
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
                posts.forEach(post => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `
                        <div class="post-card">
                            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" onclick="openLightbox(this.src)">` : ''}
                            <div class="post-content">
                                <h3>${post.title}</h3>
                                <p>${post.text}</p>
                            </div>
                        </div>
                    `;
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
            
            // Mousewheel mit reduzierten Einstellungen
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
            },
            
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
    function openLightbox(imgSrc) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = imgSrc;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Verhindert Scrollen im Hintergrund
            
            // Setze Fokus auf die Lightbox, um Tastaturnavigation zu ermöglichen
            lightbox.focus();
            
            // Event-Listener für Escape-Taste hinzufügen
            document.addEventListener('keydown', handleLightboxKeydown);
        }
    }

    function closeLightbox(event) {
        // Schließen, wenn auf den Hintergrund geklickt wird, nicht auf das Bild
        if (event && (event.target.id === 'lightbox' || event.target.classList.contains('close-lightbox'))) {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Scrollen wieder aktivieren
            
            // Event-Listener für Escape-Taste entfernen
            document.removeEventListener('keydown', handleLightboxKeydown);
            
            // Fokus zurück auf das Element setzen, das die Lightbox geöffnet hat
            if (window.lastFocusedElement) {
                window.lastFocusedElement.focus();
            }
        }
    }

    // Funktion zur Behandlung von Tastatureingaben in der Lightbox
    function handleLightboxKeydown(event) {
        if (event.key === 'Escape') {
            closeLightbox({ target: { id: 'lightbox' } });
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
    
    // Fade-In Animation für Sektionen beim Scrollen
    function setupScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        // Fade-In Klasse hinzufügen
        sections.forEach(section => {
            if (!section.classList.contains('fade-in')) {
                section.classList.add('fade-in');
            }
        });
        
        // Prüfen, ob Sektionen im Viewport sind und animieren
        function checkVisibility() {
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                // Wenn die Sektion im Viewport ist
                if (sectionTop < windowHeight * 0.8) {
                    section.classList.add('visible');
                }
            });
        }
        
        // Initial Check ausführen
        checkVisibility();
        
        // Bei Scroll erneut prüfen
        window.addEventListener('scroll', checkVisibility);
    }
    
    highlightCurrentPage();
    setupMobileMenu();
    setupSmoothScrolling();
    setupScrollAnimations();
});