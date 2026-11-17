<?php
// Buzón de Cults3D: Cults3D bloquea al servidor, así que la PC de Emanuel le pregunta y manda acá lo crudo (ventas, modelos, avisos).
// Solo se acepta si viene firmado (HMAC-SHA256 del cuerpo) con la misma llave de Cults3D que tiene el servidor: nadie más puede mandar datos.
header('Content-Type: text/plain'); header('Cache-Control: no-store');
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('no'); }
$llave = '';
foreach (@file("$base/.env") ?: [] as $l) if (preg_match('/^CULTS_KEY="?([^"\r\n]*)"?/', $l, $m)) $llave = $m[1];
if (!$llave) { http_response_code(500); exit('sin llave'); }
$cuerpo = file_get_contents('php://input');
if (strlen($cuerpo) < 20 || strlen($cuerpo) > 5000000) { http_response_code(400); exit('tamaño'); }
if (!hash_equals(hash_hmac('sha256', $cuerpo, $llave), strtolower((string)($_SERVER['HTTP_X_FIRMA'] ?? '')))) { http_response_code(403); exit('firma'); }
$j = json_decode($cuerpo, true);
if (!is_array($j) || !isset($j['yo'], $j['modelos'], $j['ventas'])) { http_response_code(400); exit('formato'); }
file_put_contents("$base/cults-pc.json", $cuerpo); chmod("$base/cults-pc.json", 0600);
if (!file_exists("$base/refrescar.pedido")) @file_put_contents("$base/refrescar.pedido", 'cults');
echo 'ok';
