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
        const batchSize = 6; // Anzahl der Bilder pro Batch
        
        for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);
            setTimeout(() => {
                loadImageBatch(batch, i);
            }, i === 0 ? 0 : 100); // Erstes Batch sofort, Rest mit Verzögerung
        }
        
        // Ladeindikator nach kurzer Zeit ausblenden
        setTimeout(hideLoadingIndicator, 1500);
        
    } catch (error) {
        console.error('Fehler beim Abrufen der Galerie:', error);
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
        imgContainer.onclick = () => openLightbox(globalIndex);
        
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

// Lightbox öffnen
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Spinner anzeigen während des Ladevorgangs
    lightboxImage.classList.add('loading');
    lightbox.style.display = 'flex';
    
    // Bild URL setzen
    const imageUrl = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${images[index]}`;
    
    // Wenn das Bild bereits im Cache ist, wird es sofort angezeigt
    if (lightboxImage.complete && lightboxImage.src === imageUrl) {
        lightboxImage.classList.remove('loading');
    } else {
        // Wenn das Bild nicht im Cache ist, warten wir auf das load-Event
        lightboxImage.onload = function() {
            lightboxImage.classList.remove('loading');
            lightboxImage.onload = null; // Event-Handler entfernen nach Verwendung
        };
        lightboxImage.src = imageUrl;
    }
}

// Lightbox schließen
function closeLightbox(event) {
    if (event.target.id === 'lightbox') {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
    }
}

// Zum nächsten Bild navigieren
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.classList.add('loading');
    
    const imageUrl = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${images[currentImageIndex]}`;
    
    if (lightboxImage.complete && lightboxImage.src === imageUrl) {
        lightboxImage.classList.remove('loading');
    } else {
        lightboxImage.onload = function() {
            lightboxImage.classList.remove('loading');
            lightboxImage.onload = null;
        };
        lightboxImage.src = imageUrl;
    }
}

// Zum vorherigen Bild navigieren
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.classList.add('loading');
    
    const imageUrl = `https://website-imageslw.s3.eu-central-1.amazonaws.com/${images[currentImageIndex]}`;
    
    if (lightboxImage.complete && lightboxImage.src === imageUrl) {
        lightboxImage.classList.remove('loading');
    } else {
        lightboxImage.onload = function() {
            lightboxImage.classList.remove('loading');
            lightboxImage.onload = null;
        };
        lightboxImage.src = imageUrl;
    }
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
