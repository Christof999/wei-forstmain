// JavaScript für das Kontaktformular
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
});

/**
 * Behandelt das Absenden des Kontaktformulars
 * @param {Event} event - Das Submit-Event
 */
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    // Elemente für Feedback
    let feedbackElement = document.getElementById('form-feedback');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.id = 'form-feedback';
        contactForm.appendChild(feedbackElement);
    }
    
    // Submit-Button Status
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        // Button-Status auf "Wird gesendet..." ändern
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
        
        // Formular-Daten sammeln
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Formular-Daten validieren
        if (!formData.name || !formData.phone || !formData.email || !formData.message) {
            throw new Error('Bitte füllen Sie alle Pflichtfelder aus.');
        }
        
        // API-Endpunkt für das Kontaktformular - direkt auf die Gateway-Ressource
        const API_ENDPOINT = 'https://dx7fo93g1i.execute-api.eu-central-1.amazonaws.com/prod/kontakt';
        
        // Anfrage an API senden
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        // Antwort prüfen
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten.');
        }
        
        // Antwort verarbeiten
        const result = await response.json();
        
        // Erfolgsmeldung anzeigen
        feedbackElement.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <p>Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
            </div>
        `;
        feedbackElement.className = 'success';
        
        // Formular zurücksetzen
        contactForm.reset();
        
    } catch (error) {
        console.error('Fehler beim Senden des Formulars:', error);
        
        // Fehlermeldung anzeigen
        feedbackElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message}</p>
            </div>
        `;
        feedbackElement.className = 'error';
        
    } finally {
        // Button-Status zurücksetzen
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // Zu Feedbackmeldung scrollen
        feedbackElement.scrollIntoView({ behavior: 'smooth' });
    }
}
