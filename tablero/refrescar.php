<?php
// Botón ↻ del tablero: deja un aviso y la tarea del servidor (cada minuto) junta los datos ya.
// No da datos ni necesita clave: lo peor que puede pasar es que se busquen datos de más, y eso está limitado a uno cada 60 s.
header('Content-Type: application/json'); header('Cache-Control: no-store');
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';   // /home/<usuario>/tablero-recolector (fuera de la web)
$aviso = $base . '/refrescar.pedido';
if (file_exists($aviso) && time() - filemtime($aviso) < 60) { echo '{"ok":true,"ya":true}'; exit; }
$f = preg_replace('/[^a-z]/', '', $_GET['fuente'] ?? '');
echo @file_put_contents($aviso, $f) !== false ? '{"ok":true}' : '{"ok":false}';
