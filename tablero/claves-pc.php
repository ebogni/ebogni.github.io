<?php
// Buzón de claves para la PC de Emanuel (⚙️ Configuración del tablero).
// El tablero manda la clave YA CIFRADA con la llave pública de la PC (pc-publica.json): acá nadie la puede leer.
// Solo se acepta si viene firmada con la llave del tablero (la misma de hecho.php). La PC la retira por SSH y la borra.
header('Content-Type: text/plain'); header('Cache-Control: no-store');
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';
$f = "$base/claves-pendientes.json";
$ok = ['GEMINI_API_KEY', 'CULTS_KEY', 'CARRERA_CLAVE', 'TELEGRAM_TOKEN', 'TELEGRAM_CHAT_ID', 'META_APP_SECRET', 'CARIMAGE_API_KEY'];
if (isset($_GET['hay'])) { $h = @json_decode(@file_get_contents($f), true) ?: []; exit((string)count($h)); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('no'); }
$nombre = (string)($_POST['nombre'] ?? ''); $cif = (string)($_POST['cifrado'] ?? '');
if (!in_array($nombre, $ok, true) || !preg_match('#^[A-Za-z0-9+/=]{100,700}$#', $cif)) { http_response_code(400); exit('datos'); }
$clave = '';
foreach (@file("$base/.env") ?: [] as $l) if (preg_match('/^TABLERO_CLAVE="?([^"\r\n]*)"?/', $l, $m)) $clave = stripcslashes($m[1]);
if (!$clave) { http_response_code(500); exit('sin clave'); }
$llave = hash_pbkdf2('sha256', $clave, 'vikingzone-tablero-v1', 250000, 32, true);
if (!hash_equals(hash_hmac('sha256', "$nombre|$cif", $llave), strtolower((string)($_POST['firma'] ?? '')))) { http_response_code(403); exit('firma'); }
$h = @json_decode(@file_get_contents($f), true) ?: [];
$h = array_values(array_filter($h, fn($x) => $x['nombre'] !== $nombre));
$h[] = ['nombre' => $nombre, 'cifrado' => $cif, 'cuando' => date('c')];
file_put_contents($f, json_encode($h)); chmod($f, 0600);
echo 'ok';
