// Consulta Wikipedia (coordenadas + foto) para una lista de títulos. Se ejecuta en GitHub Actions.
const titles = process.argv.slice(2).join(' ').split('|').map((s) => s.trim()).filter(Boolean);
const UA = { 'User-Agent': 'Rekio/1.0 (https://github.com/gonzalojoaquindev/Rekio)' };
const out = [];
for (const t of titles) {
  const [lang, ...rest] = t.split(':'); const title = rest.join(':');
  try {
    const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { headers: UA });
    const j = await r.json();
    out.push(`${t}\t${r.status}\t${j.coordinates ? j.coordinates.lat.toFixed(5) + ',' + j.coordinates.lon.toFixed(5) : '-'}\t${j.thumbnail ? 'foto:' + decodeURIComponent(j.thumbnail.source.split('/').pop()) : 'SIN FOTO'}\t${j.title || ''}`);
  } catch (e) { out.push(`${t}\tERR ${e.message}`); }
}
console.log(out.join('\n'));
