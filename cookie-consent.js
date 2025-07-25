/**
 * Cookie-Consent-Management für WeißForst GbR
 * Implementiert einen DSGVO-konformen Cookie-Banner mit Auswahlmöglichkeiten
 */

class CookieConsentManager {
    constructor() {
        this.cookieConsentKey = 'weissforst-cookie-consent';
        this.cookieConsentVersion = '1.0'; // Bei Änderungen der Cookie-Richtlinie inkrementieren
        this.cookieCategories = {
            necessary: {
                name: 'Notwendige Cookies',
                description: 'Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht deaktiviert werden.',
                required: true
            },
            functional: {
                name: 'Funktionale Cookies',
                description: 'Diese Cookies ermöglichen verbesserte Funktionalität und Personalisierung.',
                required: false
            },
            analytics: {
                name: 'Analyse-Cookies',
                description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
                required: false
            }
        };
        
        this.initCookieConsent();
    }
    
    /**
     * Initialisiert den Cookie-Consent-Mechanismus
     */
    initCookieConsent() {
        // Wenn noch keine Zustimmung gegeben wurde, Banner anzeigen
        if (!this.hasConsent()) {
            this.showCookieBanner();
        } else {
            // Wenn Zustimmung bereits gegeben wurde, Cookies gemäß Einstellungen aktivieren
            this.applyCookieSettings();
        }
        
        // Einbindung des Cookie-Einstellungs-Links im Footer
        this.addCookieSettingsLink();
    }
    
    /**
     * Cookie-Banner anzeigen
     */
    showCookieBanner() {
        const bannerHtml = `
            <div id="cookie-consent-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
                <div class="cookie-consent-content">
                    <h2 id="cookie-title">Cookie-Einstellungen</h2>
                    <p>Diese Website verwendet Cookies, um Ihr Browsing-Erlebnis zu verbessern und Analysen durchzuführen. Bitte wählen Sie, welche Arten von Cookies Sie akzeptieren möchten.</p>
                    
                    <div class="cookie-categories">
                        ${this.generateCookieCategoriesHtml()}
                    </div>
                    
                    <div class="cookie-consent-actions">
                        <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Alle akzeptieren</button>
                        <button id="cookie-save-settings" class="cookie-btn">Auswahl speichern</button>
                        <button id="cookie-reject-all" class="cookie-btn cookie-btn-secondary">Nur notwendige Cookies</button>
                    </div>
                    
                    <div class="cookie-consent-footer">
                        <p>Weitere Informationen finden Sie in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
                    </div>
                </div>
            </div>
            <div id="cookie-consent-overlay"></div>
        `;
        
        // Banner zur Seite hinzufügen
        const bannerContainer = document.createElement('div');
        bannerContainer.innerHTML = bannerHtml;
        document.body.appendChild(bannerContainer);
        
        // Event-Listener für die Buttons hinzufügen
        document.getElementById('cookie-accept-all').addEventListener('click', () => this.acceptAll());
        document.getElementById('cookie-save-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('cookie-reject-all').addEventListener('click', () => this.rejectAll());
        
        // Fokus für Barrierefreiheit
        setTimeout(() => {
            document.getElementById('cookie-consent-banner').focus();
        }, 100);
    }
    
    /**
     * Generiert HTML für die Cookie-Kategorien
     */
    generateCookieCategoriesHtml() {
        let html = '';
        
        for (const [category, info] of Object.entries(this.cookieCategories)) {
            const disabled = info.required ? 'disabled checked' : '';
            
            html += `
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <label class="cookie-switch">
                            <input type="checkbox" id="cookie-cat-${category}" ${disabled} data-category="${category}">
                            <span class="cookie-slider"></span>
                        </label>
                        <h3>${info.name}</h3>
                    </div>
                    <p>${info.description}</p>
                </div>
            `;
        }
        
        return html;
    }
    
    /**
     * Speichert die Cookie-Einstellungen ab
     */
    saveSettings() {
        const consent = {
            version: this.cookieConsentVersion,
            date: new Date().toISOString(),
            categories: {}
        };
        
        // Alle Kategorien durchgehen und Status speichern
        Object.keys(this.cookieCategories).forEach(category => {
            const checkbox = document.getElementById(`cookie-cat-${category}`);
            consent.categories[category] = this.cookieCategories[category].required || checkbox.checked;
        });
        
        // In localStorage speichern
        localStorage.setItem(this.cookieConsentKey, JSON.stringify(consent));
        
        // Cookie-Banner entfernen
        this.hideCookieBanner();
        
        // Cookies entsprechend der Auswahl setzen
        this.applyCookieSettings();
    }
    
    /**
     * Akzeptiert alle Cookies
     */
    acceptAll() {
        const consent = {
            version: this.cookieConsentVersion,
            date: new Date().toISOString(),
            categories: {}
        };
        
        // Alle Kategorien auf akzeptiert setzen
        Object.keys(this.cookieCategories).forEach(category => {
            consent.categories[category] = true;
        });
        
        // In localStorage speichern
        localStorage.setItem(this.cookieConsentKey, JSON.stringify(consent));
        
        // Cookie-Banner entfernen
        this.hideCookieBanner();
        
        // Alle Cookies aktivieren
        this.applyCookieSettings();
    }
    
    /**
     * Lehnt alle optionalen Cookies ab
     */
    rejectAll() {
        const consent = {
            version: this.cookieConsentVersion,
            date: new Date().toISOString(),
            categories: {}
        };
        
        // Nur notwendige Cookies akzeptieren
        Object.keys(this.cookieCategories).forEach(category => {
            consent.categories[category] = this.cookieCategories[category].required;
        });
        
        // In localStorage speichern
        localStorage.setItem(this.cookieConsentKey, JSON.stringify(consent));
        
        // Cookie-Banner entfernen
        this.hideCookieBanner();
        
        // Nur notwendige Cookies aktivieren
        this.applyCookieSettings();
    }
    
    /**
     * Entfernt den Cookie-Banner
     */
    hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        const overlay = document.getElementById('cookie-consent-overlay');
        
        if (banner) {
            banner.remove();
        }
        
        if (overlay) {
            overlay.remove();
        }
    }
    
    /**
     * Prüft, ob bereits eine Cookie-Zustimmung vorhanden ist
     */
    hasConsent() {
        const consent = localStorage.getItem(this.cookieConsentKey);
        
        if (!consent) {
            return false;
        }
        
        // Prüfen, ob die Version aktuell ist
        const consentData = JSON.parse(consent);
        return consentData.version === this.cookieConsentVersion;
    }
    
    /**
     * Fügt einen Link zu den Cookie-Einstellungen im Footer hinzu
     */
    addCookieSettingsLink() {
        // Footerelement finden
        const footer = document.querySelector('footer .footer-content');
        
        if (footer) {
            // Cookie-Einstellungs-Link erstellen
            const settingsLink = document.createElement('p');
            settingsLink.innerHTML = '<a href="#" id="cookie-settings-link">Cookie-Einstellungen</a>';
            footer.appendChild(settingsLink);
            
            // Event-Listener hinzufügen
            document.getElementById('cookie-settings-link').addEventListener('click', (e) => {
                e.preventDefault();
                this.showCookieBanner();
            });
        }
    }
    
    /**
     * Wendet die Cookie-Einstellungen an (aktiviert/deaktiviert Cookies basierend auf den Einstellungen)
     */
    applyCookieSettings() {
        const consent = JSON.parse(localStorage.getItem(this.cookieConsentKey));
        
        if (!consent) {
            return;
        }
        
        // Beispiel: Analytics-Cookies aktivieren/deaktivieren
        if (consent.categories.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Weitere Cookie-abhängige Funktionen hier implementieren
    }
    
    /**
     * Aktiviert Analytics (Beispielfunktion)
     */
    enableAnalytics() {
        console.log('Analytics aktiviert');
        // Hier würde der Code zur Aktivierung von Analytics-Diensten stehen
        // z.B. Google Analytics, Matomo, etc.
    }
    
    /**
     * Deaktiviert Analytics (Beispielfunktion)
     */
    disableAnalytics() {
        console.log('Analytics deaktiviert');
        // Hier würde der Code zur Deaktivierung von Analytics-Diensten stehen
    }
    
    /**
     * Setzt einen Cookie mit Name, Wert und Ablaufdatum
     */
    setCookie(name, value, days) {
        let expires = '';
        
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }
    
    /**
     * Gibt den Wert eines Cookies zurück
     */
    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        
        return null;
    }
    
    /**
     * Löscht einen Cookie
     */
    eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }
}

// Initialisierung des Cookie-Consent-Managers nach dem Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsentManager();
});
