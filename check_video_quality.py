#!/usr/bin/env python3
"""
Video-Qualitätsprüfung für S3-Video
Prüft Auflösung, Bitrate, Dateigröße und gibt Empfehlungen
"""

import subprocess
import sys
import json
from urllib.request import urlopen, Request
from urllib.parse import urlparse, quote

VIDEO_URL = "https://website-imageslw.s3.eu-central-1.amazonaws.com/Header/Weiß_Forst_Gbr_045_1080p.mp4"

def encode_url(url):
    """Kodiert URL richtig für HTTP-Requests"""
    parsed = urlparse(url)
    # Kodiere nur den Pfad-Teil
    encoded_path = quote(parsed.path, safe='/')
    return f"{parsed.scheme}://{parsed.netloc}{encoded_path}"

def check_ffprobe():
    """Prüft ob ffprobe installiert ist"""
    try:
        result = subprocess.run(['ffprobe', '-version'], 
                              capture_output=True, text=True, timeout=5)
        return True
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False

def get_video_metadata_ffprobe(video_url):
    """Holt Video-Metadaten mit ffprobe"""
    try:
        # Lade Video in den Speicher
        encoded_url = encode_url(video_url)
        req = Request(encoded_url)
        with urlopen(req, timeout=30) as response:
            video_data = response.read()
        
        # Verwende ffprobe mit stdin
        cmd = [
            'ffprobe',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            '-'
        ]
        
        process = subprocess.Popen(cmd, stdin=subprocess.PIPE, 
                                  stdout=subprocess.PIPE, 
                                  stderr=subprocess.PIPE)
        
        # Schreibe Video-Daten in ffprobe
        stdout, stderr = process.communicate(input=video_data, timeout=60)
        
        if process.returncode == 0:
            return json.loads(stdout.decode('utf-8'))
        else:
            print(f"ffprobe Fehler: {stderr.decode('utf-8')}")
            return None
    except Exception as e:
        print(f"Fehler beim Abrufen der Metadaten: {e}")
        return None

def get_http_headers(url):
    """Holt HTTP-Header-Informationen"""
    try:
        encoded_url = encode_url(url)
        req = Request(encoded_url)
        req.get_method = lambda: 'HEAD'
        with urlopen(req, timeout=10) as response:
            headers = dict(response.headers)
            return {
                'content_length': headers.get('Content-Length'),
                'content_type': headers.get('Content-Type'),
                'server': headers.get('Server'),
                'etag': headers.get('ETag'),
                'last_modified': headers.get('Last-Modified'),
                'cloudfront': headers.get('X-Amz-Cf-Id') is not None,
                'x_amz_request_id': headers.get('X-Amz-Request-Id'),
            }
    except Exception as e:
        print(f"Fehler beim Abrufen der Header: {e}")
        return None

def format_size(bytes_size):
    """Formatiert Bytes in lesbare Größe"""
    if bytes_size:
        size_mb = int(bytes_size) / (1024 * 1024)
        return f"{size_mb:.2f} MB"
    return "N/A"

def analyze_video_quality(metadata, headers):
    """Analysiert Video-Qualität und gibt Empfehlungen"""
    print("\n" + "="*60)
    print("VIDEO-QUALITÄTSANALYSE")
    print("="*60 + "\n")
    
    # HTTP-Header-Informationen
    print("📡 HTTP-Header-Informationen:")
    print("-" * 60)
    if headers:
        print(f"Server: {headers.get('server', 'N/A')}")
        print(f"CloudFront: {'✅ JA' if headers.get('cloudfront') else '❌ NEIN (direkt S3)'}")
        print(f"Content-Type: {headers.get('content_type', 'N/A')}")
        print(f"Dateigröße: {format_size(headers.get('content_length'))}")
        print(f"ETag: {headers.get('etag', 'N/A')}")
        print(f"Letzte Änderung: {headers.get('last_modified', 'N/A')}")
    print()
    
    # Video-Metadaten
    if metadata and 'streams' in metadata:
        print("🎬 Video-Metadaten:")
        print("-" * 60)
        
        video_stream = None
        for stream in metadata['streams']:
            if stream.get('codec_type') == 'video':
                video_stream = stream
                break
        
        if video_stream:
            width = int(video_stream.get('width', 0))
            height = int(video_stream.get('height', 0))
            bitrate = int(video_stream.get('bit_rate', 0))
            codec = video_stream.get('codec_name', 'N/A')
            duration = float(video_stream.get('duration', 0))
            
            print(f"Auflösung: {width}x{height} px")
            print(f"Codec: {codec}")
            print(f"Bitrate: {bitrate / 1000 / 1000:.2f} Mbps" if bitrate > 0 else "Bitrate: N/A")
            print(f"Dauer: {duration:.2f} Sekunden")
            print()
            
            # Qualitätsbewertung
            print("📊 Qualitätsbewertung:")
            print("-" * 60)
            
            issues = []
            recommendations = []
            
            # Auflösungsprüfung
            if width < 1920 or height < 1080:
                issues.append(f"⚠️  Niedrige Auflösung ({width}x{height})")
                recommendations.append("Empfehlung: Video in mindestens 1920x1080 (Full HD) hochladen")
            elif width >= 1920 and height >= 1080:
                print("✅ Auflösung: Full HD oder höher")
            
            # Bitrate-Prüfung
            if bitrate > 0:
                bitrate_mbps = bitrate / 1000 / 1000
                if bitrate_mbps < 3:
                    issues.append(f"⚠️  Niedrige Bitrate ({bitrate_mbps:.2f} Mbps)")
                    recommendations.append("Empfehlung: Bitrate von mindestens 5 Mbps für gute Qualität")
                elif bitrate_mbps < 5:
                    print(f"⚠️  Bitrate könnte höher sein ({bitrate_mbps:.2f} Mbps)")
                    recommendations.append("Empfehlung: Bitrate von 5-10 Mbps für optimale Qualität")
                else:
                    print(f"✅ Bitrate: {bitrate_mbps:.2f} Mbps (gut)")
            
            # Dateigröße vs. Dauer
            if headers and headers.get('content_length') and duration > 0:
                size_bytes = int(headers.get('content_length'))
                size_mb = size_bytes / (1024 * 1024)
                mb_per_minute = size_mb / (duration / 60)
                
                print(f"\n📦 Dateigröße: {size_mb:.2f} MB")
                print(f"📈 MB pro Minute: {mb_per_minute:.2f} MB/min")
                
                if mb_per_minute < 5:
                    issues.append("⚠️  Sehr komprimiertes Video")
                    recommendations.append("Empfehlung: Höhere Qualität beim Encoding verwenden")
                elif mb_per_minute < 10:
                    print("ℹ️  Video ist moderat komprimiert")
                else:
                    print("✅ Video hat gute Dateigröße")
            
            # Zusammenfassung
            print("\n" + "="*60)
            if issues:
                print("❌ GEFUNDENE PROBLEME:")
                for issue in issues:
                    print(f"  {issue}")
            else:
                print("✅ Keine offensichtlichen Qualitätsprobleme gefunden")
            
            if recommendations:
                print("\n💡 EMPFEHLUNGEN:")
                for rec in recommendations:
                    print(f"  {rec}")
            
        else:
            print("❌ Keine Video-Stream-Informationen gefunden")
    else:
        print("❌ Keine Metadaten verfügbar")
        print("Installieren Sie ffmpeg für detaillierte Analyse:")
        print("  macOS: brew install ffmpeg")
        print("  Linux: sudo apt-get install ffmpeg")
        print("  Windows: choco install ffmpeg")
    
    print("\n" + "="*60)
    print("\n🔍 Weitere Prüfungen:")
    print("-" * 60)
    print("1. Browser-Entwicklertools (F12):")
    print("   - Network-Tab: Prüfe tatsächliche Dateigröße")
    print("   - Console: videoElement.videoWidth/videoHeight")
    print("\n2. AWS S3 Console:")
    print("   - Prüfe Storage Class (sollte 'Standard' sein)")
    print("   - Prüfe Lifecycle-Regeln (könnten Komprimierung auslösen)")
    print("   - Prüfe ob CloudFront verwendet werden sollte")
    print("\n3. Video neu encodieren:")
    print("   - Verwende höhere Bitrate (5-10 Mbps)")
    print("   - Verwende H.264 Codec")
    print("   - Zielauflösung: 1920x1080 oder höher")

def main():
    print("🔍 Starte Video-Qualitätsprüfung...")
    print(f"Video-URL: {VIDEO_URL}\n")
    
    # Prüfe HTTP-Header
    headers = get_http_headers(VIDEO_URL)
    
    # Prüfe ob ffprobe verfügbar ist
    has_ffprobe = check_ffprobe()
    
    metadata = None
    if has_ffprobe:
        print("✅ ffprobe gefunden - hole detaillierte Metadaten...")
        metadata = get_video_metadata_ffprobe(VIDEO_URL)
    else:
        print("⚠️  ffprobe nicht gefunden")
        print("Installieren Sie ffmpeg für detaillierte Analyse:")
        print("  macOS: brew install ffmpeg")
        print("  Linux: sudo apt-get install ffmpeg")
        print()
    
    # Analysiere Qualität
    analyze_video_quality(metadata, headers)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Prüfung abgebrochen")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fehler: {e}")
        sys.exit(1)

