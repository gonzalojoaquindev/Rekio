// Categorías y etiquetas de los lugares, para explorar una ciudad completa y decidir qué ver.
export const CATEGORIES = [
  { id: 'templos', icon: '⛩️', label: 'Templos y santuarios' },
  { id: 'historia', icon: '🏯', label: 'Historia y monumentos' },
  { id: 'barrios', icon: '🏮', label: 'Barrios con encanto' },
  { id: 'museos', icon: '🏛️', label: 'Museos' },
  { id: 'miradores', icon: '🗼', label: 'Torres y miradores' },
  { id: 'parques', icon: '🌳', label: 'Parques y jardines' },
  { id: 'atracciones', icon: '✨', label: 'Atracciones y experiencias' },
  { id: 'compras', icon: '🛍️', label: 'Compras y recuerdos' },
  { id: 'comida', icon: '🍜', label: 'Para comer' },
  { id: 'noche', icon: '🌙', label: 'Vida nocturna' },
];

export const TAGS = [
  { id: 'foto', icon: '📸', label: 'Instagrameable' },
  { id: 'gratis', icon: '🆓', label: 'Gratis' },
  { id: 'nocturno', icon: '🌙', label: 'Mejor de noche' },
  { id: 'lluvia', icon: '☔', label: 'Plan con lluvia' },
  { id: 'corto', icon: '⏱️', label: 'Visita corta' },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);
export const tagById = (id) => TAGS.find((t) => t.id === id);

// Clasificación de los lugares que ya venían en los recorridos: [categoría, etiquetas]
export const CLASSIFY = {
  // Kioto · Gion
  ikedaya: ['historia', ['gratis', 'corto']],
  okuni: ['historia', ['gratis', 'corto']],
  minamiza: ['atracciones', ['foto', 'corto']],
  tatsumi: ['barrios', ['foto', 'gratis', 'nocturno']],
  kanikakuni: ['historia', ['gratis', 'corto']],
  ichiriki: ['barrios', ['foto', 'gratis', 'nocturno']],
  kaburenjo: ['atracciones', ['corto']],
  kenninji: ['templos', ['foto']],
  yasui: ['templos', ['gratis', 'corto']],
  yasakato: ['templos', ['foto', 'gratis', 'corto']],
  yasaka: ['templos', ['foto', 'gratis', 'nocturno']],
  maruyama: ['parques', ['gratis']],
  // Kioto · Kiyomizu y Higashiyama
  kiyo_niomon: ['templos', ['foto', 'gratis']],
  kiyo_pagoda: ['templos', ['foto', 'gratis']],
  kiyo_hondo: ['templos', ['foto']],
  kiyo_okunoin: ['templos', ['foto']],
  kiyo_otowa: ['templos', ['corto']],
  sannenzaka: ['barrios', ['foto', 'gratis']],
  ninenzaka: ['barrios', ['foto', 'gratis']],
  // Kioto · Palacio
  sakaimachi: ['parques', ['gratis']],
  hamaguri: ['historia', ['gratis', 'corto']],
  kenreimon: ['historia', ['gratis', 'corto']],
  seishomon: ['historia', ['gratis']],
  shishinden: ['historia', ['gratis', 'foto']],
  // Kioto · Arashiyama y Kinkaku-ji
  togetsukyo: ['historia', ['foto', 'gratis']],
  tenryuji: ['templos', ['foto']],
  nonomiya: ['templos', ['gratis', 'corto']],
  chikurin: ['parques', ['foto', 'gratis']],
  okochi: ['parques', ['foto']],
  kinkaku_view: ['templos', ['foto']],
  kinkaku_pine: ['templos', []],
  anmintaku: ['templos', []],
  sekkatei: ['templos', []],
  ryoanji: ['templos', []],
  // Tokio · Asakusa
  tk_kaminarimon: ['templos', ['foto', 'gratis', 'nocturno']],
  tk_nakamise: ['compras', ['foto', 'gratis']],
  tk_hozomon: ['templos', ['foto', 'gratis']],
  tk_gojunoto: ['templos', ['foto', 'gratis', 'nocturno']],
  tk_sensoji: ['templos', ['foto', 'gratis', 'nocturno']],
  tk_asakusajinja: ['templos', ['gratis', 'corto']],
  tk_azumabashi: ['miradores', ['foto', 'gratis', 'nocturno']],
  // Tokio · Meiji y Harajuku
  tk_meiji_torii: ['templos', ['foto', 'gratis']],
  tk_sakadaru: ['templos', ['foto', 'gratis', 'corto']],
  tk_meiji_honden: ['templos', ['gratis']],
  tk_kiyomasa: ['parques', ['corto']],
  tk_takeshita: ['compras', ['foto', 'gratis']],
  // Tokio · Edo y Palacio
  tk_tokyoeki: ['historia', ['foto', 'gratis', 'nocturno', 'lluvia']],
  tk_kusunoki: ['historia', ['gratis', 'corto']],
  tk_nijubashi: ['historia', ['foto', 'gratis']],
  tk_otemon: ['historia', ['gratis']],
  tk_hyakunin: ['historia', ['gratis']],
  tk_tenshudai: ['historia', ['gratis']],
  // Tokio · Shibuya
  tk_hachiko: ['historia', ['foto', 'gratis', 'corto']],
  tk_scramble: ['atracciones', ['foto', 'gratis', 'nocturno', 'corto']],
  tk_myth: ['museos', ['gratis', 'corto', 'lluvia']],
  tk_nonbei: ['noche', ['foto', 'nocturno']],
  tk_miyashita: ['parques', ['gratis']],
  tk_shibuyasky: ['miradores', ['foto', 'nocturno']],
  // Tokio · Ueno
  ue_saigo: ['historia', ['gratis', 'corto']],
  ue_kiyomizu: ['templos', ['foto', 'gratis', 'corto']],
  ue_bentendo: ['templos', ['gratis']],
  ue_toshogu: ['templos', ['foto']],
  ue_pagoda: ['templos', ['gratis', 'corto']],
  // Tokio · Koishikawa
  kk_seimon: ['parques', ['foto']],
  kk_osensui: ['parques', ['foto']],
  kk_engetsukyo: ['parques', ['foto']],
  kk_tsutenkyo: ['parques', ['foto']],
  // Tokio · Shinjuku
  sj_neko: ['atracciones', ['foto', 'gratis', 'corto']],
  sj_godzilla: ['atracciones', ['foto', 'gratis', 'corto', 'nocturno']],
  sj_omoide: ['noche', ['foto', 'nocturno']],
  // Nara
  nara_kofukuji: ['templos', ['gratis']],
  nara_shika: ['parques', ['foto', 'gratis']],
  nara_nandaimon: ['templos', ['foto', 'gratis']],
  nara_daibutsuden: ['templos', ['foto', 'lluvia']],
  nara_nigatsudo: ['templos', ['foto', 'gratis']],
  nara_kasuga: ['templos', ['foto']],
  // La Serena
  ls_plaza: ['historia', ['gratis']],
  ls_catedral: ['templos', ['gratis']],
  ls_merced: ['templos', ['gratis']],
  ls_sanagustin: ['templos', ['gratis']],
  ls_sanfrancisco: ['templos', ['gratis']],
};

// Paradas que son una parte de otro lugar: no se listan sueltas en "todos los lugares"
export const PARTS = new Set([
  'kinkaku_pine', 'anmintaku', 'sekkatei', 'kiyo_niomon', 'kiyo_pagoda', 'kiyo_okunoin', 'kiyo_otowa',
  'hamaguri', 'kenreimon', 'seishomon', 'tk_hozomon', 'tk_gojunoto', 'tk_sakadaru', 'tk_kiyomasa',
  'tk_otemon', 'tk_hyakunin', 'ue_pagoda', 'kk_osensui', 'kk_engetsukyo', 'kk_tsutenkyo', 'tk_meiji_torii',
  'ls_plaza', 'ls_catedral', 'ls_merced', 'ls_sanagustin', 'ls_sanfrancisco',
]);
