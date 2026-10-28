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
  const j = await r.json(); if (!j.access_token) throw new Error('Google no dio permiso: ' + JSON.stringify(j).slice(0, 160) + ` [secreto ${/^GOCSPX-[\w-]+$/.test(secreto || '') ? 'con forma correcta' : 'MAL FORMADO'} (${(secreto || '').length} letras), permiso ${/^1\/\/[\w-]+$/.test(refresh || '') ? 'con forma correcta' : 'MAL FORMADO'} (${(refresh || '').length} letras)]`); return j.access_token;
}

// ---------- Fuentes ----------
// Instalaciones exactas por app, de los informes que Play Console deja en su Cloud Storage (llegan con 1 o 2 días de atraso).
async function instalaciones(tok, pkg) {
  const B = F.playConsole.bucket, hoy = new Date(Date.now() - 3 * 3600e3), filas = [];
  for (const m of [new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - 1, 1)), hoy]) {
    const ym = m.getUTCFullYear() + String(m.getUTCMonth() + 1).padStart(2, '0');
    const obj = encodeURIComponent(`stats/installs/installs_${pkg}_${ym}_overview.csv`);
    const r = await fetch(`https://storage.googleapis.com/storage/v1/b/${B}/o/${obj}?alt=media`, { headers: { Authorization: 'Bearer ' + tok } });
    if (r.status === 404) continue; if (!r.ok) throw new Error('Play Console ' + r.status + ': ' + (await r.text()).slice(0, 120));
    const buf = Buffer.from(await r.arrayBuffer()), txt = buf[0] === 0xff && buf[1] === 0xfe ? buf.toString('utf16le') : buf.toString('utf8');
    const lin = txt.replace(/^\ufeff/, '').trim().split(/\r?\n/), cab = lin[0].split(',').map(x => x.trim());
    for (const l of lin.slice(1)) { const c = l.split(','); filas.push(Object.fromEntries(cab.map((k, i) => [k, c[i]]))); }
  }
  if (!filas.length) return null;
  filas.sort((a, b) => a.Date < b.Date ? -1 : 1);
  const u = filas[filas.length - 1], ult7 = filas.slice(-7), n = k => +(u[k] || 0);
  return { fecha: u.Date, total: n('Total User Installs'), activos: n('Active Device Installs'), semana: ult7.reduce((t, f) => t + +(f['Daily User Installs'] || 0), 0), bajasSemana: ult7.reduce((t, f) => t + +(f['Daily User Uninstalls'] || 0), 0) };
}

const APPS = {}; // Todo lo de cada app junto: descargas, instalaciones, puntaje y plata.
const app = n => (APPS[n] ||= { nombre: n });
async function play() {
  const items = [];
  let tok = null, errIns = null; if (E.ADMOB_REFRESH_TOKEN) { try { tok = await tokenGoogle(E.GOOGLE_CLIENT_ID || F.admob.clientId, E.GOOGLE_CLIENT_SECRET, E.ADMOB_REFRESH_TOKEN); } catch (e) { } }
  for (const a of F.play) {
    try {
      const d = await gplay.app({ appId: a.id, lang: 'es', country: 'ar' });
      let ins = null; if (tok) { try { ins = await instalaciones(tok, a.id); } catch (e) { errIns = e.message; } }
      Object.assign(app(a.nombre), { play: d.url, descargasRango: d.installs, descargasMin: d.minInstalls, puntaje: d.score, votos: d.ratings, version: d.version, ...(ins ? { instalaciones: ins.total, activas: ins.activos, nuevas7: ins.semana, bajas7: ins.bajasSemana, datoDel: ins.fecha } : {}) });
      if (ins) items.push({ nombre: a.nombre, valor: fmt(ins.total), unidad: 'instalaciones', detalle: `${fmt(ins.activos)} la tienen instalada hoy · +${fmt(ins.semana)} nuevas y −${fmt(ins.bajasSemana)} bajas en 7 días · ★ ${d.score ? d.score.toFixed(1) : '—'} (${fmt(d.ratings)} votos) · dato del ${ins.fecha}`, link: d.url, num: ins.total });
      else items.push({ nombre: a.nombre, valor: d.installs || fmt(d.minInstalls), unidad: 'descargas', detalle: `★ ${d.score ? d.score.toFixed(1) : '—'} (${fmt(d.ratings)} votos) · versión ${d.version || '—'} · actualizada ${d.updated ? new Date(d.updated).toLocaleDateString('es-AR') : '—'}`, link: d.url, num: d.minInstalls });
    } catch (e) { app(a.nombre).noFigura = true; items.push({ nombre: a.nombre, valor: 'No figura', detalle: 'Google Play no la muestra (en revisión o sin publicar)', estado: 'alerta' }); }
  }
  if (errIns) items.push({ nombre: 'Instalaciones exactas', valor: 'Sin permiso', detalle: errIns, estado: 'espera' });
  return { id: 'play', titulo: 'Google Play', icono: '📱', items };
}

let PLATA = null; // Resumen de plata para los números grandes y los gráficos del tablero.
async function admob() {
  if (!E.ADMOB_REFRESH_TOKEN) return pendiente('admob', 'Ganancias de AdMob', '💰', 'Falta conectar AdMob (paso de permisos).');
  const tok = await tokenGoogle(E.GOOGLE_CLIENT_ID || F.admob.clientId, E.GOOGLE_CLIENT_SECRET, E.ADMOB_REFRESH_TOKEN);
  const hoy = new Date(Date.now() - 3 * 3600e3), d = x => ({ year: x.getUTCFullYear(), month: x.getUTCMonth() + 1, day: x.getUTCDate() });
  const ini = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1)), hace13 = new Date(hoy - 13 * 864e5);
  const iniAnt = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - 1, 1)), finAnt = new Date(ini - 864e5);
  const pedir = async (desde, hasta, dims) => {
    const r = await fetch(`https://admob.googleapis.com/v1/accounts/${F.admob.cuenta}/networkReport:generate`, { method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportSpec: { dateRange: { startDate: d(desde), endDate: d(hasta) }, dimensions: dims, metrics: ['ESTIMATED_EARNINGS', 'IMPRESSIONS', 'AD_REQUESTS'], localizationSettings: { currencyCode: 'USD' } } }) });
    const j = await r.json(); if (!Array.isArray(j)) throw new Error(JSON.stringify(j).slice(0, 200));
    return j.filter(x => x.row).map(x => ({ dims: Object.fromEntries(Object.entries(x.row.dimensionValues || {}).map(([k, v]) => [k, v.displayLabel || v.value])), gan: +(x.row.metricValues.ESTIMATED_EARNINGS?.microsValue || 0) / 1e6, imp: +(x.row.metricValues.IMPRESSIONS?.integerValue || 0) }));
  };
  const porAppHoy = await pedir(hoy, hoy, ['APP']), porDia = await pedir(hace13, hoy, ['DATE']), porApp = await pedir(ini, hoy, ['APP']), porFormato = await pedir(ini, hoy, ['FORMAT']), antes = await pedir(iniAnt, finAnt, []);
  const iso = x => x.slice(0, 4) + '-' + x.slice(4, 6) + '-' + x.slice(6, 8);
  const serie = []; for (let k = 13; k >= 0; k--) { const f = new Date(hoy - k * 864e5).toISOString().slice(0, 10); const r = porDia.find(x => iso(x.dims.DATE) === f); serie.push({ fecha: f, gan: r ? r.gan : 0, imp: r ? r.imp : 0 }); }
  const hoyD = serie[13], ayerD = serie[12];
  const mes = porApp.reduce((s, x) => s + x.gan, 0), dia = hoy.getUTCDate(), diasMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0)).getUTCDate();
  const proy = dia > 1 ? (mes - hoyD.gan) / (dia - 1) * diasMes : mes; // días completos, sin contar hoy que va por la mitad
  // Saldo a cobrar aproximado: el saldo que viste en AdMob en una fecha + lo ganado desde entonces.
  let saldo = null; const sb = F.admob.saldoBase;
  if (sb && sb.fecha) { const desde = new Date(sb.fecha + 'T12:00:00Z'); const extra = desde <= hoy ? (await pedir(new Date(+desde + 864e5), hoy, [])).reduce((s, x) => s + x.gan, 0) : 0; saldo = sb.monto + extra; }
  const NOMBRES = { BANNER: 'Banner', INTERSTITIAL: 'Pantalla completa', REWARDED: 'Video con premio', REWARDED_INTERSTITIAL: 'Pantalla completa con premio', NATIVE: 'Nativo', APP_OPEN: 'Al abrir la app' };
  const ecpm = x => x.imp ? x.gan / x.imp * 1000 : 0;
  PLATA = { hoy: hoyD.gan, ayer: ayerD.gan, impHoy: hoyD.imp, mes, proy, mesAnterior: antes.reduce((s, x) => s + x.gan, 0), saldo, umbral: F.admob.umbralUSD, serie,
    porApp: porApp.sort((a, b) => b.gan - a.gan).map(x => ({ nombre: x.dims.APP, gan: x.gan, imp: x.imp, ecpm: ecpm(x) })),
    porFormato: porFormato.sort((a, b) => b.gan - a.gan).map(x => ({ nombre: NOMBRES[x.dims.FORMAT] || x.dims.FORMAT, gan: x.gan, imp: x.imp, ecpm: ecpm(x) })) };
  for (const x of porApp) Object.assign(app(x.dims.APP), { ganMes: x.gan, impMes: x.imp, ecpm: ecpm(x) });
  for (const x of porAppHoy) Object.assign(app(x.dims.APP), { ganHoy: x.gan, impHoy: x.imp });
  const items = [{ nombre: 'Hoy', valor: usd(hoyD.gan), num: hoyD.gan }, { nombre: 'Este mes', valor: usd(mes), num: mes }];
  return { id: 'admob', titulo: 'Ganancias de AdMob', icono: '💰', items, oculta: true };
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
  for (const g of F.crazygames) items.push({ nombre: 'CrazyGames · ' + g.nombre, valor: g.estado, estado: /rechaz/i.test(g.estado) ? 'alerta' : 'espera' });
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

// Clics en el link de promoción (jugar.html): llegan al instante, mucho antes que las estadísticas de Google.
async function clics() {
  const NS = 'https://abacus.jasoncameron.dev/get/vikingzone-clics/', items = [];
  const leer = async k => { const r = await fetch(NS + k); if (r.status === 404) return 0; if (!r.ok) throw new Error('contador ' + r.status); return (await r.json()).value || 0; };
  const ayer = k => { const h = previo?.historial?.['clics|' + k] || {}; const ds = Object.keys(h).filter(d => d < hoyISO()).sort(); return ds.length ? h[ds[ds.length - 1]] : null; };
  let tot = 0;
  for (const de of (F.clics?.fuentes || ['youtube', 'tiktok', 'directo'])) {
    const [play, demo, visita] = await Promise.all(['play', 'demo', 'visita'].map(d => leer(`carrera-${de}-${d}`)));
    const n = play + demo + visita; tot += n; if (!n) continue;
    const nom = de[0].toUpperCase() + de.slice(1), a = ayer(nom), hoy = a == null ? null : n - a;
    items.push({ nombre: nom, valor: fmt(n), num: n, unidad: 'clics', detalle: `${fmt(play)} fueron a Google Play · ${fmt(demo)} a la demo${hoy != null ? ` · +${fmt(hoy)} hoy` : ''}` });
  }
  if (!items.length) items.push({ nombre: 'Todavía nadie tocó el link', valor: '0', detalle: 'Cuenta los clics en ebogni.github.io/carrera/jugar.html?de=...', estado: 'espera' });
  return { id: 'clics', titulo: 'Clics en el link del juego', icono: '👆', items, total: tot };
}

function pendiente(id, titulo, icono, txt) { return { id, titulo, icono, items: [{ nombre: 'Sin conectar', valor: '—', detalle: txt, estado: 'espera' }] }; }

// ---------- Armado ----------
const clv = E.TABLERO_CLAVE; if (!clv) { console.error('Falta el secreto TABLERO_CLAVE.'); process.exit(1); }
const K = await clave(clv);
let previo = null; try { previo = await descifrar(K, JSON.parse(fs.readFileSync(SALIDA, 'utf8'))); } catch (e) { }
const secciones = [], errores = [];
for (const [n, f] of [['AdMob', admob], ['Google Play', play], ['YouTube', youtube], ['Clics', clics], ['Portales', portales], ['Cults3D', cults]]) {
  try { secciones.push(await f()); } catch (e) { errores.push(n + ': ' + e.message); const p = previo && previo.secciones.find(s => s.titulo.includes(n)); if (p) secciones.push({ ...p, viejo: true }); }
}
// Historial diario para ver cómo crece cada número (se guarda el último valor de cada día, 90 días).
const hist = (previo && previo.historial) || {}, dia = hoyISO();
for (const s of secciones) for (const it of s.items) if (it.num != null && !it.sub) { const k = s.id + '|' + it.nombre; (hist[k] ||= {})[dia] = it.num; const ks = Object.keys(hist[k]).sort(); while (ks.length > 90) delete hist[k][ks.shift()]; }
const avisos = [];
for (const s of secciones) for (const it of s.items) if (it.estado === 'alerta') avisos.push(`${s.titulo}: ${it.nombre} — ${it.valor}`);
if (PLATA) { const prom = PLATA.serie.slice(6, 13).reduce((t, x) => t + x.gan, 0) / 7; if (prom > 0.05 && PLATA.ayer < prom * 0.5) avisos.push(`Ayer ganaste ${usd(PLATA.ayer)}, menos de la mitad de lo normal (${usd(prom)} por día).`); }
const descargas = secciones.find(s => s.id === 'play')?.items.reduce((t, it) => t + (it.num || 0), 0) ?? null;
if (descargas != null) (hist['total|descargas'] ||= {})[dia] = descargas;
if (PLATA) (hist['total|mes'] ||= {})[dia] = PLATA.mes;
for (const a of Object.values(APPS)) { if (a.instalaciones != null) (hist['app|' + a.nombre + '|ins'] ||= {})[dia] = a.instalaciones; if (a.ganMes != null) (hist['app|' + a.nombre + '|gan'] ||= {})[dia] = a.ganMes; }
const datos = { v: 2, apps: Object.values(APPS).sort((a, b) => (b.ganMes || 0) - (a.ganMes || 0) || (b.instalaciones || b.descargasMin || 0) - (a.instalaciones || a.descargasMin || 0)), actualizado: new Date().toISOString(), plata: PLATA, descargas, avisos, secciones, errores, historial: hist };
fs.writeFileSync(SALIDA, JSON.stringify(await cifrar(K, datos)));
// Estado público (sin números): qué fuentes andan, para revisar fallas sin abrir el tablero.
fs.writeFileSync(DIR + '../tablero/estado.json', JSON.stringify({ actualizado: datos.actualizado, fuentes: secciones.map(s => ({ fuente: s.titulo, estado: s.viejo ? 'error (muestra el dato anterior)' : s.items[0]?.nombre === 'Sin conectar' ? 'sin conectar' : 'ok', notas: s.items.filter(i => i.estado === 'espera' && i.nombre !== 'Sin conectar').map(i => i.nombre + ': ' + (i.detalle || i.valor)).concat(s.id === 'play' ? [`${s.items.filter(i => i.unidad === 'instalaciones').length} apps con instalaciones exactas`] : []) })), errores }, null, 1));
console.log('Listo:', secciones.map(s => s.titulo).join(', '), errores.length ? '| errores: ' + errores.join(' / ') : '');
