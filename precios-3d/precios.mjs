// Precios de referencia del rollo de filamento de 1 kg por país y material, desde la búsqueda pública de Mercado Libre.
// Lo corre .github/workflows/precios-3d.yml una vez por semana y deja filakot/precios.json (lo lee la app FilaKot 3D).
// Para cada país y material: busca "filamento <material> 1.75 1kg", se queda con publicaciones de 1 kg, saca los
// precios raros (muy baratos o muy caros) y guarda la mediana.
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const PAISES = { ARS: "MLA", BRL: "MLB", MXN: "MLM", CLP: "MLC", COP: "MCO", PEN: "MPE", UYU: "MLU" };
const MATERIALES = { pla: "PLA", petg: "PETG", abs: "ABS", asa: "ASA", tpu: "TPU" };
const SALIDA = new URL("../filakot/precios.json", import.meta.url);
const espera = ms => new Promise(r => setTimeout(r, ms));
// Autorización: desde 2025 Mercado Libre exige un token para buscar. Se saca con la app de desarrollador de Emanuel
// (secretos ML_CLIENT_ID y ML_CLIENT_SECRET en GitHub). Sin esos secretos, el trabajo no hace nada y queda el archivo anterior.
let TOKEN = process.env.ML_TOKEN || "";
if (!TOKEN && process.env.ML_CLIENT_ID && process.env.ML_CLIENT_SECRET) {
  const r = await fetch("https://api.mercadolibre.com/oauth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.ML_CLIENT_ID, client_secret: process.env.ML_CLIENT_SECRET }) });
  const j = await r.json().catch(() => ({}));
  if (j.access_token) TOKEN = j.access_token; else console.log("No se pudo sacar el token de Mercado Libre:", r.status, JSON.stringify(j).slice(0, 200));
}
if (!TOKEN) { console.log("Falta la autorización de Mercado Libre (secretos ML_CLIENT_ID y ML_CLIENT_SECRET): no se actualiza nada."); process.exit(0); }

async function buscar(sitio, q) {
  const url = `https://api.mercadolibre.com/sites/${sitio}/search?q=${encodeURIComponent(q)}&limit=50`;
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url, { headers: { "Accept": "application/json", ...(TOKEN ? { Authorization: "Bearer " + TOKEN } : {}) }, signal: AbortSignal.timeout(20000) });
    if (r.ok) return (await r.json()).results || [];
    console.log(`${sitio} "${q}": HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
    if (r.status === 401 || r.status === 403) return null;
    await espera(2000 * (i + 1));
  }
  return [];
}
function mediana(v) { const a = [...v].sort((x, y) => x - y), m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
function limpiar(precios) { // saca los raros: fuera de [Q1 - 1.5·IQR, Q3 + 1.5·IQR]
  const a = [...precios].sort((x, y) => x - y); if (a.length < 4) return a;
  const q1 = a[Math.floor(a.length * 0.25)], q3 = a[Math.floor(a.length * 0.75)], d = q3 - q1;
  return a.filter(p => p >= q1 - 1.5 * d && p <= q3 + 1.5 * d);
}

const anterior = existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, "utf8")) : { precios: {} };
const precios = {}; let bloqueado = false;
for (const [moneda, sitio] of Object.entries(PAISES)) {
  precios[moneda] = {};
  for (const [id, nombre] of Object.entries(MATERIALES)) {
    const res = await buscar(sitio, `filamento ${nombre} 1.75 1kg`);
    if (res === null) { bloqueado = true; break; }
    const ok = res.filter(x => x.currency_id === moneda && /\b1\s?kg\b|1000\s?g/i.test(x.title) && new RegExp("\\b" + nombre + "\\b", "i").test(x.title) && !/\b(pack|kit|x\s?[2-9]|[2-9]\s?(un|rollos|kg))\b/i.test(x.title)).map(x => x.price);
    const lim = limpiar(ok);
    if (lim.length >= 5) precios[moneda][id] = { mediana: Math.round(mediana(lim)), muestras: lim.length };
    else if (anterior.precios?.[moneda]?.[id]) precios[moneda][id] = anterior.precios[moneda][id];
    console.log(`${moneda} ${nombre}: ${ok.length} publicaciones de 1 kg, ${lim.length} usadas -> ${precios[moneda][id]?.mediana ?? "sin dato"}`);
    await espera(400);
  }
  if (bloqueado) break;
}
if (bloqueado) { console.log("Mercado Libre pide autorización para buscar: no se actualiza nada (queda el archivo anterior)."); process.exit(0); }
writeFileSync(SALIDA, JSON.stringify({ actualizado: new Date().toISOString().slice(0, 10), fuente: "Mercado Libre (mediana de publicaciones de 1 kg)", precios }, null, 1) + "\n");
console.log("Listo:", SALIDA.pathname);
