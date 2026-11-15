// Cambia la clave del tablero en el servidor SIN perder nada: descifra con la clave vieja (.env) los datos y el permiso de Google,
// los vuelve a cifrar con la nueva (clave.nueva, que dejó nueva-clave.php) y actualiza .env. Lo llama ejecutar.sh. Nadie más ve la clave.
import fs from 'fs';
const DIR = new URL('.', import.meta.url).pathname;
const SAL = new TextEncoder().encode('vikingzone-tablero-v1');
const TDIR = (process.env.TABLERO_DIR || DIR + '../tablero').replace(/\/$/, '') + '/';
async function clave(pass) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: SAL, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
const b64 = u => Buffer.from(u).toString('base64'), deb64 = s => new Uint8Array(Buffer.from(s, 'base64'));
async function cifrar(k, obj) { const iv = crypto.getRandomValues(new Uint8Array(12)); const d = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(JSON.stringify(obj))); return { v: 1, iv: b64(iv), d: b64(new Uint8Array(d)) }; }
async function descifrar(k, c) { const d = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: deb64(c.iv) }, k, deb64(c.d)); return JSON.parse(new TextDecoder().decode(d)); }

const nueva = fs.readFileSync(DIR + 'clave.nueva', 'utf8').replace(/\r?\n$/, '');
fs.unlinkSync(DIR + 'clave.nueva');
if (nueva.length < 6) { console.log('Clave nueva muy corta: no se cambió'); process.exit(1); }
const vieja = process.env.TABLERO_CLAVE, kv = await clave(vieja), kn = await clave(nueva);
for (const f of [TDIR + 'datos.json', DIR + 'permiso-google.json']) {
  try { const obj = await descifrar(kv, JSON.parse(fs.readFileSync(f, 'utf8'))); fs.writeFileSync(f, JSON.stringify(await cifrar(kn, obj))); console.log('Recifrado:', f.split('/').pop()); }
  catch (e) { console.log('No se pudo recifrar', f.split('/').pop(), '-', e.message); }
}
const env = fs.readFileSync(DIR + '.env', 'utf8').split('\n').filter(l => !l.startsWith('TABLERO_CLAVE='));
env.unshift('TABLERO_CLAVE="' + nueva.replace(/"/g, '\\"') + '"');
fs.writeFileSync(DIR + '.env', env.join('\n')); fs.chmodSync(DIR + '.env', 0o600);
fs.writeFileSync(DIR + 'permiso-propio', 'el permiso de Google de acá está cifrado con la clave del servidor: no pisarlo al subir');
console.log('Clave del tablero cambiada');
