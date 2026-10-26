// Junta los números de todas las apps, canales y portales, los cifra con la clave del tablero
// y los deja en tablero/datos.json. Lo corre GitHub cada 30 minutos (.github/workflows/tablero.yml).
// Cada fuente es independiente: si le falta su permiso o falla, el tablero lo muestra y sigue con las demás.
import fs from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import gplay from 'google-play-scraper';

const DIR = new URL('.', import.meta.url).pathname;
const SALIDA = DIR + '../tablero/datos.json';
const F = JSON.parse(fs.readFileSync(DIR + 'fuentes.json', 'utf8'));
const E = process.env;
const fmt = n => n == null || isNaN(n) ? '—' : Number(n).toLocaleString('es-AR');
const usd = n => n == null ? '—' : 'US$ ' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const hoyISO = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); // hora de Argentina

// ---------- Cifrado (mismo esquema que lee tablero/index.html) ----------
const SAL = new TextEncoder().encode('vikingzone-tablero-v1');
async function clave(pass) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: SAL, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
const b64 = u => Buffer.from(u).toString('base64'), deb64 = s => new Uint8Array(Buffer.from(s, 'base64'));
async function cifrar(k, obj) { const iv = crypto.getRandomValues(new Uint8Array(12)); const d = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(JSON.stringify(obj))); return { v: 1, iv: b64(iv), d: b64(new Uint8Array(d)) }; }
async function descifrar(k, c) { const d = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: deb64(c.iv) }, k, deb64(c.d)); return JSON.parse(new TextDecoder().decode(d)); }

// ---------- Google: token a partir de un refresh token ----------
async function tokenGoogle(id, secreto, refresh) {
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secreto, refresh_token: refresh, grant_type: 'refresh_token' }) });
  const j = await r.json(); if (!j.access_token) throw new Error('Google no dio permiso: ' + (j.error_description || j.error)); return j.access_token;
}

// ---------- Fuentes ----------
async function play() {
  const items = [];
  for (const a of F.play) {
    try {
      const d = await gplay.app({ appId: a.id, lang: 'es', country: 'ar' });
      items.push({ nombre: a.nombre, valor: d.installs || fmt(d.minInstalls), unidad: 'descargas', detalle: `★ ${d.score ? d.score.toFixed(1) : '—'} (${fmt(d.ratings)} votos) · versión ${d.version || '—'} · actualizada ${d.updated ? new Date(d.updated).toLocaleDateString('es-AR') : '—'}`, link: d.url, num: d.minInstalls });
    } catch (e) { items.push({ nombre: a.nombre, valor: 'No figura', detalle: 'Google Play no la muestra (en revisión o sin publicar)', estado: 'alerta' }); }
  }
  return { id: 'play', titulo: 'Google Play', icono: '📱', items };
}

async function admob() {
  if (!E.ADMOB_REFRESH_TOKEN) return pendiente('admob', 'Ganancias de AdMob', '💰', 'Falta conectar AdMob (paso de permisos).');
  const tok = await tokenGoogle(E.GOOGLE_CLIENT_ID || F.admob.clientId, E.GOOGLE_CLIENT_SECRET, E.ADMOB_REFRESH_TOKEN);
  const hoy = new Date(Date.now() - 3 * 3600e3), d = (x) => ({ year: x.getUTCFullYear(), month: x.getUTCMonth() + 1, day: x.getUTCDate() });
  const ini = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1)), hace7 = new Date(hoy - 6 * 864e5);
  const pedir = async (desde, dims) => {
    const r = await fetch(`https://admob.googleapis.com/v1/accounts/${F.admob.cuenta}/networkReport:generate`, { method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportSpec: { dateRange: { startDate: d(desde), endDate: d(hoy) }, dimensions: dims, metrics: ['ESTIMATED_EARNINGS', 'IMPRESSIONS', 'AD_REQUESTS'], localizationSettings: { currencyCode: 'USD' } } }) });
    const j = await r.json(); if (!Array.isArray(j)) throw new Error(JSON.stringify(j).slice(0, 200));
    return j.filter(x => x.row).map(x => ({ dims: Object.fromEntries(Object.entries(x.row.dimensionValues || {}).map(([k, v]) => [k, v.displayLabel || v.value])), gan: +(x.row.metricValues.ESTIMATED_EARNINGS?.microsValue || 0) / 1e6, imp: +(x.row.metricValues.IMPRESSIONS?.integerValue || 0) }));
  };
  const porDia = await pedir(hace7, ['DATE']), porApp = await pedir(ini, ['APP']);
  const dHoy = porDia.find(x => x.dims.DATE === hoyISO().replace(/-/g, '')) || { gan: 0, imp: 0 };
  const sem = porDia.reduce((s, x) => s + x.gan, 0), mes = porApp.reduce((s, x) => s + x.gan, 0);
  const items = [
    { nombre: 'Hoy', valor: usd(dHoy.gan), detalle: `${fmt(dHoy.imp)} anuncios vistos`, num: dHoy.gan },
    { nombre: 'Últimos 7 días', valor: usd(sem), detalle: porDia.map(x => usd(x.gan).replace('US$ ', '$')).join(' · ') },
    { nombre: 'Este mes', valor: usd(mes), detalle: `AdMob paga al llegar a US$ ${F.admob.umbralUSD} acumulados` },
    ...porApp.sort((a, b) => b.gan - a.gan).map(x => ({ nombre: x.dims.APP, valor: usd(x.gan), detalle: `${fmt(x.imp)} anuncios este mes` })),
  ];
  return { id: 'admob', titulo: 'Ganancias de AdMob', icono: '💰', items };
}

async function youtube() {
  if (!E.YOUTUBE_KEY) return pendiente('youtube', 'YouTube', '▶️', 'Falta la llave de YouTube (paso de permisos).');
  const canales = [];
  for (const ch of F.youtube) {
    const q = ch.id ? `id=${ch.id}` : `forHandle=${encodeURIComponent(ch.handle)}`;
    const j = await (await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&${q}&key=${E.YOUTUBE_KEY}`)).json();
    if (!j.items) throw new Error(JSON.stringify(j.error || j).slice(0, 200));
    canales.push(...j.items);
  }
  const items = [];
  for (const c of canales) {
    const s = c.statistics;
    items.push({ nombre: c.snippet.title, valor: fmt(s.subscriberCount), unidad: 'suscriptores', detalle: `${fmt(s.viewCount)} vistas en total · ${fmt(s.videoCount)} videos`, num: +s.viewCount, link: 'https://www.youtube.com/channel/' + c.id });
    // Últimos videos con sus vistas.
    const up = 'UU' + c.id.slice(2);
    const pl = await (await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=5&playlistId=${up}&key=${E.YOUTUBE_KEY}`)).json();
    const vids = (pl.items || []).map(x => x.contentDetails.videoId).join(',');
    if (vids) {
      const v = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${vids}&key=${E.YOUTUBE_KEY}`)).json();
      for (const x of v.items || []) items.push({ nombre: '· ' + x.snippet.title, valor: fmt(x.statistics.viewCount), unidad: 'vistas', detalle: `${fmt(x.statistics.likeCount)} me gusta · ${new Date(x.snippet.publishedAt).toLocaleDateString('es-AR')}`, sub: true, link: 'https://youtu.be/' + x.id });
    }
  }
  return { id: 'youtube', titulo: 'YouTube', icono: '▶️', items };
}

async function portales() {
  const items = [];
  for (const g of F.y8) {
    const r = await fetch(g.url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = r.ok ? await r.text() : '';
    const jugadas = (html.match(/([\d.,]+)\s*(plays|partidas|jugadas)/i) || [])[1];
    items.push(r.ok ? { nombre: 'Y8 · ' + g.nombre, valor: jugadas || 'Publicado', unidad: jugadas ? 'partidas' : '', link: g.url } : { nombre: 'Y8 · ' + g.nombre, valor: 'En revisión', detalle: 'Todavía no está publicada', estado: 'espera' });
  }
  for (const g of F.crazygames) items.push({ nombre: 'CrazyGames · ' + g.nombre, valor: g.estado, estado: 'alerta' });
  return { id: 'portales', titulo: 'Portales web', icono: '🌐', items };
}

async function cults() {
  if (!E.CULTS_KEY || !F.cults3d.usuario) return pendiente('cults', 'Cults3D', '🧩', 'Falta tu usuario y la llave de la API de Cults3D (paso de permisos).');
  const q = `{ myself { user { nick creationsCount followersCount } salesBatch(limit: 5) { total results { createdAt income { cents currency } creation { name(locale: ES) } } } } }`;
  const r = await fetch('https://cults3d.com/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(F.cults3d.usuario + ':' + E.CULTS_KEY).toString('base64') }, body: JSON.stringify({ query: q }) });
  const j = await r.json();
  if (j.errors) { // Si cambió la API, anoto qué campos tiene para corregir la consulta.
    const ins = await (await fetch('https://cults3d.com/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(F.cults3d.usuario + ':' + E.CULTS_KEY).toString('base64') }, body: JSON.stringify({ query: '{ s: __type(name: "Sale") { fields { name } } u: __type(name: "User") { fields { name } } }' }) })).json().catch(() => ({}));
    const camp = t => (ins.data?.[t]?.fields || []).map(f => f.name).join(',');
    throw new Error(j.errors.map(e => e.message).join('; ').slice(0, 150) + ' | Sale: ' + camp('s') + ' | User: ' + camp('u'));
  }
  const m = j.data.myself, u = m.user;
  const items = [{ nombre: u.nick, valor: fmt(u.followersCount), unidad: 'seguidores', detalle: `${fmt(u.creationsCount)} modelos publicados` },
    { nombre: 'Ventas', valor: fmt(m.salesBatch.total), unidad: 'en total' },
    ...m.salesBatch.results.map(s => ({ nombre: '· ' + s.creation.name, valor: (s.income.cents / 100).toFixed(2) + ' ' + s.income.currency, detalle: new Date(s.createdAt).toLocaleDateString('es-AR'), sub: true }))];
  return { id: 'cults', titulo: 'Cults3D', icono: '🧩', items };
}

function pendiente(id, titulo, icono, txt) { return { id, titulo, icono, items: [{ nombre: 'Sin conectar', valor: '—', detalle: txt, estado: 'espera' }] }; }

// ---------- Armado ----------
const clv = E.TABLERO_CLAVE; if (!clv) { console.error('Falta el secreto TABLERO_CLAVE.'); process.exit(1); }
const K = await clave(clv);
let previo = null; try { previo = await descifrar(K, JSON.parse(fs.readFileSync(SALIDA, 'utf8'))); } catch (e) { }
const secciones = [], errores = [];
for (const [n, f] of [['AdMob', admob], ['Google Play', play], ['YouTube', youtube], ['Portales', portales], ['Cults3D', cults]]) {
  try { secciones.push(await f()); } catch (e) { errores.push(n + ': ' + e.message); const p = previo && previo.secciones.find(s => s.titulo.includes(n)); if (p) secciones.push({ ...p, viejo: true }); }
}
// Historial diario para ver cómo crece cada número (se guarda el último valor de cada día, 90 días).
const hist = (previo && previo.historial) || {}, dia = hoyISO();
for (const s of secciones) for (const it of s.items) if (it.num != null && !it.sub) { const k = s.id + '|' + it.nombre; (hist[k] ||= {})[dia] = it.num; const ks = Object.keys(hist[k]).sort(); while (ks.length > 90) delete hist[k][ks.shift()]; }
const datos = { actualizado: new Date().toISOString(), secciones, errores, historial: hist };
fs.writeFileSync(SALIDA, JSON.stringify(await cifrar(K, datos)));
// Estado público (sin números): qué fuentes andan, para revisar fallas sin abrir el tablero.
fs.writeFileSync(DIR + '../tablero/estado.json', JSON.stringify({ actualizado: datos.actualizado, fuentes: secciones.map(s => ({ fuente: s.titulo, estado: s.viejo ? 'error (muestra el dato anterior)' : s.items[0]?.nombre === 'Sin conectar' ? 'sin conectar' : 'ok' })), errores }, null, 1));
console.log('Listo:', secciones.map(s => s.titulo).join(', '), errores.length ? '| errores: ' + errores.join(' / ') : '');
