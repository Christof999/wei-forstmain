// NOTE:
// This is a *client-side* login gate for GitHub Pages (static hosting).
// It is NOT real security. Anyone can view/modify client code.
// It only keeps casual visitors out of index_original.html.

const DRAFT_AUTH_KEY = 'wei_forst_draft_auth_v1';
const AUTH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

// Login credentials (username is checked directly; password is verified via PBKDF2-derived key)
const EXPECTED_USERNAME = 'Lukas';
const PBKDF2_ITERATIONS = 200000;
const PBKDF2_SALT_B64 = '+5pIcot4eODIqtWCYP5bmw==';
const EXPECTED_DERIVED_B64 = 'LNzW0+c7adZfKsw+90rdrAaZGvbBi9xDqmfX7ZE5Nb8=';

function base64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

function bytesToBase64(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
}

async function pbkdf2Sha256(password, saltBytes, iterations, lengthBytes = 32) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations },
        keyMaterial,
        lengthBytes * 8
    );

    return new Uint8Array(bits);
}

function setDraftAuth() {
    const payload = {
        issuedAt: Date.now(),
        expiresAt: Date.now() + AUTH_TTL_MS,
    };
    localStorage.setItem(DRAFT_AUTH_KEY, JSON.stringify(payload));
}

function getNextTarget() {
    const url = new URL(window.location.href);
    const next = url.searchParams.get('next');
    // Only allow local navigation within this site
    if (next && !next.includes('://') && !next.startsWith('//')) return next;
    return 'index_original.html';
}

function showError(msg) {
    const el = document.getElementById('loginError');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = (document.getElementById('username')?.value || '').trim();
        const password = (document.getElementById('password')?.value || '');

        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.style.display = 'none';

        if (!username || !password) {
            showError('Bitte Benutzer und Passwort eingeben.');
            return;
        }

        if (username !== EXPECTED_USERNAME) {
            showError('Benutzer oder Passwort ist falsch.');
            return;
        }

        try {
            const salt = base64ToBytes(PBKDF2_SALT_B64);
            const derived = await pbkdf2Sha256(password, salt, PBKDF2_ITERATIONS, 32);
            const derivedB64 = bytesToBase64(derived);

            if (derivedB64 !== EXPECTED_DERIVED_B64) {
                showError('Benutzer oder Passwort ist falsch.');
                return;
            }

            setDraftAuth();
            window.location.href = getNextTarget();
        } catch (err) {
            console.error('Login error:', err);
            showError('Login konnte nicht durchgeführt werden. Bitte erneut versuchen.');
        }
    });
});

