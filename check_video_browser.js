// Video-Qualitätsprüfung im Browser
// In der Browser-Konsole (F12) ausführen:

// 1. Video-Element finden
const video = document.querySelector('header video');
if (video) {
    console.log('=== Video-Informationen ===');
    console.log('Video-URL:', video.currentSrc || video.src);
    console.log('Video-Breite (natürlich):', video.videoWidth, 'px');
    console.log('Video-Höhe (natürlich):', video.videoHeight, 'px');
    console.log('Video-Breite (angezeigt):', video.clientWidth, 'px');
    console.log('Video-Höhe (angezeigt):', video.clientHeight, 'px');
    console.log('Video-Dauer:', video.duration, 'Sekunden');
    console.log('Video-Format:', video.videoTracks ? video.videoTracks[0] : 'N/A');
    
    // Berechne Skalierungsfaktor
    if (video.videoWidth > 0) {
        const scaleX = video.clientWidth / video.videoWidth;
        const scaleY = video.clientHeight / video.videoHeight;
        console.log('Skalierungsfaktor X:', scaleX.toFixed(2));
        console.log('Skalierungsfaktor Y:', scaleY.toFixed(2));
        
        if (scaleX > 1.5 || scaleY > 1.5) {
            console.warn('⚠️ Video wird stark hochskaliert - das kann Qualitätsverlust verursachen!');
        }
    }
    
    // Prüfe Video-Auflösung
    if (video.videoWidth < 1920 || video.videoHeight < 1080) {
        console.warn('⚠️ Video-Auflösung ist niedriger als Full HD (1920x1080)');
        console.log('Empfohlen: Mindestens 1920x1080 für gute Qualität');
    }
    
    // Prüfe ob Video geladen ist
    video.addEventListener('loadedmetadata', () => {
        console.log('Video-Metadaten geladen');
        console.log('Tatsächliche Auflösung:', video.videoWidth + 'x' + video.videoHeight);
    });
    
    // Prüfe Netzwerk-Informationen
    if (performance && performance.getEntriesByType) {
        const videoResource = performance.getEntriesByType('resource').find(
            entry => entry.name.includes('Weiß_Forst_Gbr_045.MP4')
        );
        if (videoResource) {
            console.log('=== Netzwerk-Informationen ===');
            console.log('Dateigröße (geladen):', (videoResource.transferSize / 1024 / 1024).toFixed(2), 'MB');
            console.log('Ladezeit:', videoResource.duration.toFixed(2), 'ms');
            console.log('Transfer-Größe:', (videoResource.transferSize / 1024 / 1024).toFixed(2), 'MB');
        }
    }
} else {
    console.error('Video-Element nicht gefunden');
}

// 2. Prüfe ob CloudFront verwendet wird
fetch('https://website-imageslw.s3.eu-central-1.amazonaws.com/Header/Weiß_Forst_Gbr_045.MP4', {method: 'HEAD'})
    .then(response => {
        console.log('=== Server-Informationen ===');
        console.log('Server:', response.headers.get('server'));
        console.log('X-Amz-Request-Id:', response.headers.get('x-amz-request-id'));
        console.log('CloudFront:', response.headers.get('x-amz-cf-id') ? 'JA (CloudFront)' : 'NEIN (direkt S3)');
        console.log('Content-Length:', (parseInt(response.headers.get('content-length')) / 1024 / 1024).toFixed(2), 'MB');
    });

