// Renueva el permiso de Google del tablero SIN copiar claves a mano:
// toma el código que Google te muestra después de aceptar los permisos, lo canjea con el secreto
// GOOGLE_CLIENT_SECRET que ya está en GitHub y guarda el permiso nuevo cifrado con la clave del tablero
// (tablero-recolector/permiso-google.json). El recolector lo usa en lugar de ADMOB_REFRESH_TOKEN.
import fs from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
const E = process.env, DIR = new URL('.', import.meta.url).pathname;
const SAL = new TextEncoder().encode('vikingzone-tablero-v1');
const codigo = decodeURIComponent((E.CODIGO || '').trim().replace(/^.*[?&]code=/, '').replace(/&.*$/, ''));
if (!codigo) { console.error('Falta el código.'); process.exit(1); }
const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ code: codigo, client_id: E.GOOGLE_CLIENT_ID || JSON.parse(fs.readFileSync(DIR + 'fuentes.json', 'utf8')).admob.clientId, client_secret: E.GOOGLE_CLIENT_SECRET, redirect_uri: E.REDIRECCION || 'https://developers.google.com/oauthplayground', grant_type: 'authorization_code' }) });
const j = await r.json();
if (!j.refresh_token) { console.error('Google no dio el permiso: ' + (j.error_description || j.error || JSON.stringify(j).slice(0, 200)) + '\nSi dice "invalid_grant", el código ya se usó o venció (dura unos minutos): pedí uno nuevo.'); process.exit(1); }
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(E.TABLERO_CLAVE), 'PBKDF2', false, ['deriveKey']);
const K = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: SAL, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const iv = crypto.getRandomValues(new Uint8Array(12));
const d = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, K, new TextEncoder().encode(JSON.stringify({ refresh: j.refresh_token, permisos: j.scope, fecha: new Date().toISOString() })));
fs.writeFileSync(DIR + 'permiso-google.json', JSON.stringify({ v: 1, iv: Buffer.from(iv).toString('base64'), d: Buffer.from(new Uint8Array(d)).toString('base64') }));
console.log('Listo. Permisos nuevos: ' + (j.scope || '').split(' ').map(x => x.split('/').pop()).join(', '));
