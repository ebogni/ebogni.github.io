<?php
// "Ya lo hice" de las sugerencias del tablero: guarda el id para que la sugerencia no se muestre más.
// Solo vale si viene firmado (HMAC-SHA256 del id) con la llave que sale de la clave del tablero: la misma con la que se abren los datos.
header('Content-Type: text/plain'); header('Cache-Control: no-store');
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('no'); }
$id = (string)($_POST['id'] ?? '');
if (!preg_match('/^[0-9a-f]{12}$/', $id)) { http_response_code(400); exit('id'); }
$clave = '';
foreach (@file("$base/.env") ?: [] as $l) if (preg_match('/^TABLERO_CLAVE="?([^"\r\n]*)"?/', $l, $m)) $clave = stripcslashes($m[1]);
if (!$clave) { http_response_code(500); exit('sin clave'); }
$llave = hash_pbkdf2('sha256', $clave, 'vikingzone-tablero-v1', 250000, 32, true);
if (!hash_equals(hash_hmac('sha256', $id, $llave), strtolower((string)($_POST['firma'] ?? '')))) { http_response_code(403); exit('firma'); }
$f = "$base/sugerencias-hechas.json";
$h = @json_decode(@file_get_contents($f), true) ?: [];
if (!in_array($id, $h, true)) { $h[] = $id; file_put_contents($f, json_encode($h)); }
if (!file_exists("$base/refrescar.pedido")) @file_put_contents("$base/refrescar.pedido", 'sugerencias');
echo 'ok';
