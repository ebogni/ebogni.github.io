<?php
// Página de UN solo uso para elegir una clave nueva del tablero. Funciona solo con el código que deja "Tablero: subir al servidor"
// (vence a los 30 minutos) y se borra sola al usarse. La clave va directo al servidor: no queda en ningún otro lado.
$base = explode('/domains/', __DIR__)[0] . '/tablero-recolector';
$cod = @trim(file_get_contents("$base/.codigo-clave"));
$vivo = $cod && time() < @filemtime("$base/.codigo-clave") + 1800 && hash_equals($cod, (string)($_REQUEST['c'] ?? ''));
$msg = '';
if ($vivo && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $a = (string)($_POST['a'] ?? ''); $b = (string)($_POST['b'] ?? '');
  if (strlen($a) < 8) $msg = 'Tiene que tener al menos 8 letras o números.';
  elseif ($a !== $b) $msg = 'Las dos no coinciden. Probá de nuevo.';
  else { file_put_contents("$base/clave.nueva", $a); chmod("$base/clave.nueva", 0600); @unlink("$base/.codigo-clave"); @unlink(__FILE__); $listo = true; }
}
?><!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Clave nueva del tablero</title><style>body{font:18px system-ui;background:#10131c;color:#eef;display:flex;justify-content:center;padding:40px 16px}main{max-width:380px;width:100%}
input{width:100%;font:20px system-ui;padding:10px;border-radius:10px;border:1px solid #445;background:#1b2030;color:#fff;margin:6px 0 14px;box-sizing:border-box}
button{width:100%;font:20px system-ui;padding:12px;border:0;border-radius:12px;background:#3b82f6;color:#fff}.m{color:#fca5a5}</style></head><body><main>
<?php if (!empty($listo)): ?><h1>¡Listo!</h1><p>En un minuto la clave nueva queda andando. Entrá a <a style="color:#93c5fd" href="./">vikingzone.app/tablero</a> con ella.</p>
<?php elseif (!$vivo): ?><h1>Este link ya no sirve</h1><p>Venció o ya se usó. Pedí uno nuevo.</p>
<?php else: ?><h1>Clave nueva del tablero</h1><p>Elegí una que te acuerdes y guardala en el navegador cuando te lo ofrezca.</p>
<?php if ($msg) echo "<p class=m>$msg</p>"; ?><form method="post"><input type="hidden" name="c" value="<?= htmlspecialchars($_REQUEST['c']) ?>">
<input type="text" name="u" value="tablero" autocomplete="username" hidden>
<label>Clave nueva<input type="password" name="a" autocomplete="new-password" required minlength="8"></label>
<label>Repetila<input type="password" name="b" autocomplete="new-password" required minlength="8"></label><button>Guardar</button></form>
<?php endif; ?></main></body></html>
