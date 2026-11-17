<?php
// Buzón de Cults3D: Cults3D bloquea al servidor, así que la PC de Emanuel le pregunta y manda acá lo crudo (ventas, modelos, avisos).
// Solo se acepta si viene firmado (HMAC-SHA256 del cuerpo) con el secreto de la PC (.secreto-pc) o, si no hay, con la llave de Cults3D del servidor.
header('Content-Type: text/plain'); header('Cache-Control: no-store');
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('no'); }
// Emparejar la PC (una sola vez): la PC inventa un secreto y lo manda. Solo se acepta si hay un ".emparejar" recién subido
// (lo deja Claude al subir el recolector, vale 1 hora) y todavía no hay secreto guardado.
if (isset($_GET['emparejar'])) {
  $s = trim(file_get_contents('php://input'));
  if (file_exists("$base/.secreto-pc") || !file_exists("$base/.emparejar") || time() - filemtime("$base/.emparejar") > 3600 || !preg_match('/^[0-9a-f]{64}$/', $s)) { http_response_code(403); exit('no'); }
  file_put_contents("$base/.secreto-pc", $s); chmod("$base/.secreto-pc", 0600); @unlink("$base/.emparejar"); exit('emparejada');
}
$llave = @trim(@file_get_contents("$base/.secreto-pc"));
if (!$llave) foreach (@file("$base/.env") ?: [] as $l) if (preg_match('/^CULTS_KEY="?([^"\r\n]*)"?/', $l, $m)) $llave = $m[1];
if (!$llave) { http_response_code(500); exit('sin llave'); }
$cuerpo = file_get_contents('php://input');
if (strlen($cuerpo) < 20 || strlen($cuerpo) > 5000000) { http_response_code(400); exit('tamaño'); }
if (!hash_equals(hash_hmac('sha256', $cuerpo, $llave), strtolower((string)($_SERVER['HTTP_X_FIRMA'] ?? '')))) { http_response_code(403); exit('firma'); }
$j = json_decode($cuerpo, true);
if (!is_array($j) || !isset($j['yo'], $j['modelos'], $j['ventas'])) { http_response_code(400); exit('formato'); }
file_put_contents("$base/cults-pc.json", $cuerpo); chmod("$base/cults-pc.json", 0600);
if (!file_exists("$base/refrescar.pedido")) @file_put_contents("$base/refrescar.pedido", 'cults');
echo 'ok';
