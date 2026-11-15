// Consulta Wikipedia (coordenadas + foto) o busca archivos en Commons. Se ejecuta en GitHub Actions.
//  en:Título | ja:Título  → coordenadas y foto del artículo
//  cs:texto               → primeros archivos de Wikimedia Commons que coinciden
const items = process.argv.slice(2).join(' ').split('|').map((s) => s.trim()).filter(Boolean);
const UA = { 'User-Agent': 'Rekio/1.0 (https://github.com/gonzalojoaquindev/Rekio)' };
const out = [];
for (const t of items) {
  const [lang, ...rest] = t.split(':'); const q = rest.join(':');
  try {
    if (lang === 'cs') {
      const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=6&srsearch=${encodeURIComponent(q)}`;
      const j = await (await fetch(u, { headers: UA })).json();
      out.push(`${t}\t${(j.query?.search || []).map((s) => s.title.replace('File:', '')).join(' ;; ')}`);
      continue;
    }
    const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`, { headers: UA });
    const j = await r.json();
    out.push(`${t}\t${r.status}\t${j.coordinates ? j.coordinates.lat.toFixed(5) + ',' + j.coordinates.lon.toFixed(5) : '-'}\t${j.thumbnail ? 'foto' : 'SIN FOTO'}\t${j.title || ''}`);
  } catch (e) { out.push(`${t}\tERR ${e.message}`); }
}
console.log(out.join('\n'));
