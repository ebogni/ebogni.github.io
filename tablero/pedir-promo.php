<?php
// Botón "📣 Armar publicación" del tablero: deja el pedido para la PC de Emanuel (que arma y manda la promoción).
// Solo se acepta firmado con la llave del tablero. La PC pregunta ?hay=1 cada minuto, lo retira por SSH y avisa en estado-promo.json.
header('Content-Type: text/plain'); header('Cache-Control: no-store');
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';
$f = "$base/pedido-promo.json";
if (isset($_GET['hay'])) { $p = @json_decode(@file_get_contents($f), true); exit($p ? $p['app'] : ''); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('no'); }
$app = (string)($_POST['app'] ?? '');
if (!preg_match('/^[a-z]{3,20}$/', $app)) { http_response_code(400); exit('app'); }
$clave = '';
foreach (@file("$base/.env") ?: [] as $l) if (preg_match('/^TABLERO_CLAVE="?([^"\r\n]*)"?/', $l, $m)) $clave = stripcslashes($m[1]);
if (!$clave) { http_response_code(500); exit('sin clave'); }
$llave = hash_pbkdf2('sha256', $clave, 'vikingzone-tablero-v1', 250000, 32, true);
if (!hash_equals(hash_hmac('sha256', "promo|$app", $llave), strtolower((string)($_POST['firma'] ?? '')))) { http_response_code(403); exit('firma'); }
file_put_contents($f, json_encode(['app' => $app, 'cuando' => date('c')]));
file_put_contents(__DIR__ . '/estado-promo.json', json_encode(['estado' => 'pedido', 'app' => $app, 'cuando' => time()]));
echo 'ok';
