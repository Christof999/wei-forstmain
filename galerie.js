const API_ENDPOINT = 'https://avppe0rz0a.execute-api.eu-central-1.amazonaws.com/test1/gallery';

let images = [];
let currentImageIndex = 0;

// Ladeindikator anzeigen
function showLoadingIndicator() {
    const galleryDiv = document.getElementById('gallery');
    const loader = document.createElement('div');
    loader.classList.add('gallery-loader');
    loader.id = 'gallery-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Bilder werden geladen...</p>
    `;
    galleryDiv.appendChild(loader);
}

// Ladeindikator ausblenden
function hideLoadingIndicator() {
    const loader = document.getElementById('gallery-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Haupt-Funktion zum Laden der Galerie
async function fetchGallery() {
    try {
        showLoadingIndicator();
        
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
        
        const { body } = await response.json();
        images = JSON.parse(body).filter(img => !img.endsWith('/')); // Filter Ordner aus
        
        const galleryDiv = document.getElementById('gallery');
        galleryDiv.innerHTML = ''; // Galerie leeren
        
        // Optimierung: Bilder in Batches mit kleiner Verzögerung laden
        // Dies verhindert Browserblockaden und verteilt die Netzwerklast
        const batchSize = 60; // Anzahl der Bilder pro Batch
        
        for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);
            setTimeout(() => {
                loadImageBatch(batch, i);
            }, i === 0 ? 0 : 100); // Erstes Batch sofort, Rest mit Verzögerung
        }
        
        // Ladeindikator nach kurzer Zeit ausblenden
        setTimeout(hideLoadingIndicator, 1500);
        
    } catch (error) {
        hideLoadingIndicator();
        
        const galleryDiv = document.getElementById('gallery');
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('gallery-error');
        errorMsg.textContent = 'Beim Laden der Bilder ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
        galleryDiv.appendChild(errorMsg);
    }
}

// Laden eines Batches von Bildern
function loadImageBatch(batch, startIndex) {
    const galleryDiv = document.getElementById('gallery');
    
    batch.forEach((img, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-item');
        
        const imgElement = document.createElement('img');
        imgElement.alt = img;
        
        // Index innerhalb aller Bilder berechnen
        const globalIndex = startIndex + index;
        
        // Klick-Event direkt hinzufügen (ohne Abhängigkeit vom Load-Event)
        imgContainer.onclick = () => openGalleryLightbox(globalIndex);
        
        // Bild mit src direkt setzen (traditionelle Methode)
        imgElement.src = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${img}`;
        
        // Einfachen Spinner als Überlagerung hinzufügen
        const spinner = document.createElement('div');
        spinner.classList.add('image-loading-spinner');
        
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(spinner);
        
        // Spinner entfernen, wenn Bild geladen ist
        imgElement.onload = function() {
            spinner.style.display = 'none';
        };
        
        galleryDiv.appendChild(imgContainer);
    });
}

// Lightbox öffnen - unterstützt sowohl Index (Zahl) als auch direkte URL (String)
function openGalleryLightbox(index) {
    console.log('openGalleryLightbox aufgerufen mit Index:', index, 'Bild:', images[index]);
    
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (!lightbox || !lightboxImage) {
        console.error('Lightbox-Elemente nicht gefunden');
        return;
    }
    
    if (!images[index]) {
        console.error('Bild-Index ungültig:', index, 'Images Array:', images);
        return;
    }
    
    // Bild URL konstruieren
    const imageUrl = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${images[index]}`;
    console.log('Lade Bild:', imageUrl);
    
    // Lightbox anzeigen
    lightbox.style.display = 'flex';
    
    // Alte src entfernen und loading state setzen
    lightboxImage.src = '';
    lightboxImage.classList.add('loading');
    
    // Warte kurz, dann setze die neue src
    setTimeout(() => {
        // onload Handler setzen BEVOR src gesetzt wird
        lightboxImage.onload = function() {
            console.log('Bild geladen:', imageUrl);
            lightboxImage.classList.remove('loading');
            lightboxImage.onload = null;
        };
        
        // onerror Handler für Fehlerbehandlung
        lightboxImage.onerror = function() {
            console.error('Fehler beim Laden des Bildes:', imageUrl);
            lightboxImage.classList.remove('loading');
            lightboxImage.onerror = null;
        };
        
        // Setze die neue src
        lightboxImage.src = imageUrl;
    }, 10);
}

// Überschreibe die window.openLightbox aus script.js für die Galerie-Seite
// Diese Funktion erkennt automatisch, ob ein Index oder eine URL übergeben wurde
window.openLightbox = function(indexOrUrl) {
    // Wenn es eine Zahl ist, nutze die Galerie-Logik
    if (typeof indexOrUrl === 'number') {
        openGalleryLightbox(indexOrUrl);
    } 
    // Wenn es ein String ist, könnte es eine direkte URL sein (für andere Seiten)
    else if (typeof indexOrUrl === 'string') {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage) {
            lightbox.style.display = 'flex';
            lightboxImage.src = '';
            lightboxImage.classList.add('loading');
            
            setTimeout(() => {
                lightboxImage.onload = function() {
                    lightboxImage.classList.remove('loading');
                    lightboxImage.onload = null;
                };
                lightboxImage.onerror = function() {
                    lightboxImage.classList.remove('loading');
                    lightboxImage.onerror = null;
                };
                lightboxImage.src = indexOrUrl;
            }, 10);
        }
    }
};

// Lightbox schließen
function closeLightbox(event) {
    if (event.target.id === 'lightbox') {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
    }
}

// Zum nächsten Bild navigieren
function nextImage(event) {
    if (event) {
        event.stopPropagation();
    }
    
    currentImageIndex = (currentImageIndex + 1) % images.length;
    console.log('Nächstes Bild - Index:', currentImageIndex, 'Bild:', images[currentImageIndex]);
    
    if (!images[currentImageIndex]) {
        console.error('Bild-Index ungültig:', currentImageIndex);
        return;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    const imageUrl = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${images[currentImageIndex]}`;
    
    // Alte src entfernen und loading state setzen
    lightboxImage.src = '';
    lightboxImage.classList.add('loading');
    
    // Kurz warten, dann neue src setzen
    setTimeout(() => {
        lightboxImage.onload = function() {
            console.log('Bild geladen:', imageUrl);
            lightboxImage.classList.remove('loading');
            lightboxImage.onload = null;
        };
        
        lightboxImage.onerror = function() {
            console.error('Fehler beim Laden des Bildes:', imageUrl);
            lightboxImage.classList.remove('loading');
            lightboxImage.onerror = null;
        };
        
        lightboxImage.src = imageUrl;
    }, 10);
}

// Zum vorherigen Bild navigieren
function prevImage(event) {
    if (event) {
        event.stopPropagation();
    }
    
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    console.log('Vorheriges Bild - Index:', currentImageIndex, 'Bild:', images[currentImageIndex]);
    
    if (!images[currentImageIndex]) {
        console.error('Bild-Index ungültig:', currentImageIndex);
        return;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    const imageUrl = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${images[currentImageIndex]}`;
    
    // Alte src entfernen und loading state setzen
    lightboxImage.src = '';
    lightboxImage.classList.add('loading');
    
    // Kurz warten, dann neue src setzen
    setTimeout(() => {
        lightboxImage.onload = function() {
            console.log('Bild geladen:', imageUrl);
            lightboxImage.classList.remove('loading');
            lightboxImage.onload = null;
        };
        
        lightboxImage.onerror = function() {
            console.error('Fehler beim Laden des Bildes:', imageUrl);
            lightboxImage.classList.remove('loading');
            lightboxImage.onerror = null;
        };
        
        lightboxImage.src = imageUrl;
    }, 10);
}

// Tastatur-Events für Lightbox-Navigation
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'flex') {
        if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'Escape') {
            lightbox.style.display = 'none';
        }
    }
});

// Initialisierung
document.addEventListener('DOMContentLoaded', fetchGallery);
