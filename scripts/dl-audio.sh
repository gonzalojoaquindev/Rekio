#!/bin/sh
# Descarga archivos de Wikimedia Commons (uno por línea en scripts/audio-files.txt) a /tmp/out
mkdir -p /tmp/out
while IFS= read -r f; do
  [ -z "$f" ] && continue
  curl -sSL -A "Rekio/1.0 (https://github.com/gonzalojoaquindev/Rekio)" -o "/tmp/out/$f" "https://commons.wikimedia.org/wiki/Special:FilePath/$(node -e 'console.log(encodeURIComponent(process.argv[1]))' "$f")"
  ls -la "/tmp/out/$f"
done < scripts/audio-files.txt
