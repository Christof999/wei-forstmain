#!/bin/bash

# Video-Qualitätsprüfung für S3-Video
VIDEO_URL="https://website-imageslw.s3.eu-central-1.amazonaws.com/Header/Weiß_Forst_Gbr_045.MP4"

echo "=== Video-Qualitätsprüfung ==="
echo ""
echo "1. HTTP-Header-Informationen:"
echo "-------------------------------"
curl -I "$VIDEO_URL" 2>&1 | grep -E "(Content-Length|Content-Type|Server|ETag|Last-Modified)"
echo ""

echo "2. Dateigröße:"
echo "-------------------------------"
CONTENT_LENGTH=$(curl -I "$VIDEO_URL" 2>&1 | grep -i "Content-Length" | awk '{print $2}' | tr -d '\r')
if [ ! -z "$CONTENT_LENGTH" ]; then
    SIZE_MB=$(echo "scale=2; $CONTENT_LENGTH / 1024 / 1024" | bc)
    echo "Dateigröße: $CONTENT_LENGTH bytes (~$SIZE_MB MB)"
fi
echo ""

echo "3. Video-Metadaten (falls ffprobe installiert):"
echo "-------------------------------"
if command -v ffprobe &> /dev/null; then
    curl -s "$VIDEO_URL" | ffprobe -v quiet -print_format json -show_format -show_streams - 2>/dev/null | grep -E "(width|height|bit_rate|codec_name|duration)" | head -10
else
    echo "ffprobe nicht installiert. Installieren mit: brew install ffmpeg"
fi
echo ""

echo "4. Browser-Entwicklertools:"
echo "-------------------------------"
echo "Öffnen Sie die Browser-Entwicklertools (F12) und prüfen Sie:"
echo "- Network-Tab: Video-Dateigröße und Ladezeit"
echo "- Video-Element: Rechtsklick -> 'Video-URL kopieren' und in neuem Tab öffnen"
echo "- Console: videoElement.videoWidth und videoElement.videoHeight"
echo ""

echo "5. Direkte Video-URL zum Testen:"
echo "-------------------------------"
echo "$VIDEO_URL"
echo ""

echo "=== Mögliche Probleme ==="
echo "- Video-Auflösung zu niedrig (< 1920x1080)"
echo "- Bitrate zu niedrig (< 5 Mbps)"
echo "- Browser skaliert Video hoch (check videoWidth/videoHeight)"
echo "- S3-Bucket hat möglicherweise Lifecycle-Regeln die Komprimierung anwenden"

