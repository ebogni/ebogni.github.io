<?php
// Almacén de ideas — guardado en el servidor (vikingzone.app/ideas/api.php).
// Base SQLite fuera de la carpeta pública: <cuenta>/ideas-datos/ideas.sqlite
// Seguridad: todo pide la clave del almacén (cabecera X-Clave). La clave se crea una sola vez, la primera vez que se abre la app.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origen, ['https://vikingzone.app', 'https://ebogni.github.io'], true)) {
  header("Access-Control-Allow-Origin: $origen");
  header('Vary: Origin');
  header('Access-Control-Allow-Headers: Content-Type, X-Clave');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') exit;

function salir($datos, $codigo = 200) { http_response_code($codigo); echo json_encode($datos, JSON_UNESCAPED_UNICODE); exit; }

$base = getenv('IDEAS_DATOS') ?: (explode('/domains/', __DIR__)[0] . '/ideas-datos');
if (!is_dir($base) && !@mkdir($base, 0700, true)) salir(['error' => 'No se pudo crear la carpeta de datos.'], 500);
$archivoClave = "$base/clave.hash";
$archivoIntentos = "$base/intentos.json";

try {
  $db = new PDO("sqlite:$base/ideas.sqlite");
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->exec('PRAGMA journal_mode=WAL');
  $db->exec('CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY, titulo TEXT, texto TEXT, categoria TEXT,
    creada TEXT, actualizada TEXT, estado TEXT DEFAULT "pendiente",
    cerrada TEXT, nota TEXT, borrada INTEGER DEFAULT 0)');
  $db->exec('CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY, valor TEXT)');
} catch (Exception $e) { salir(['error' => 'No se pudo abrir la base de datos.'], 500); }

// ---------- Clave ----------
$entrada = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
$accion = $_GET['accion'] ?? ($entrada['accion'] ?? 'leer');

if ($accion === 'estado') salir(['ok' => true, 'tieneClave' => file_exists($archivoClave)]);

if ($accion === 'crearClave') {
  if (file_exists($archivoClave)) salir(['error' => 'La clave ya está creada.'], 409);
  $c = (string)($entrada['clave'] ?? '');
  if (mb_strlen($c) < 6) salir(['error' => 'La clave tiene que tener al menos 6 letras o números.'], 400);
  file_put_contents($archivoClave, password_hash($c, PASSWORD_DEFAULT), LOCK_EX);
  @chmod($archivoClave, 0600);
  salir(['ok' => true]);
}

// Freno contra probar claves: después de 10 errores, 15 minutos de espera.
$int = @json_decode(@file_get_contents($archivoIntentos), true) ?: ['n' => 0, 't' => 0];
if ($int['n'] >= 10 && time() - $int['t'] < 900) salir(['error' => 'Demasiados intentos. Esperá 15 minutos.'], 429);
$hash = @file_get_contents($archivoClave);
if (!$hash) salir(['error' => 'Todavía no hay clave creada.', 'sinClave' => true], 401);
if (!password_verify((string)($_SERVER['HTTP_X_CLAVE'] ?? ''), $hash)) {
  $int = ['n' => ($int['n'] >= 10 ? 0 : $int['n']) + 1, 't' => time()];
  file_put_contents($archivoIntentos, json_encode($int));
  salir(['error' => 'Clave incorrecta.', 'claveMal' => true], 403);
}
if ($int['n']) @unlink($archivoIntentos);

// ---------- Datos ----------
$campos = ['id', 'titulo', 'texto', 'categoria', 'creada', 'actualizada', 'estado', 'cerrada', 'nota', 'borrada'];
function todo($db) {
  $L = $db->query('SELECT * FROM ideas')->fetchAll(PDO::FETCH_ASSOC);
  foreach ($L as &$x) $x['borrada'] = (int)$x['borrada'];
  $cats = $db->query("SELECT valor FROM ajustes WHERE clave='categorias'")->fetchColumn();
  return ['ok' => true, 'ideas' => $L, 'categorias' => $cats ? json_decode($cats, true) : null, 'hora' => gmdate('c')];
}

if ($accion === 'leer') salir(todo($db));

if ($accion === 'sincronizar') {
  // Recibe las ideas que cambiaron en el celu. Gana la versión más nueva (campo "actualizada").
  $ideas = is_array($entrada['ideas'] ?? null) ? $entrada['ideas'] : [];
  if (count($ideas) > 2000) salir(['error' => 'Demasiadas ideas de una vez.'], 413);
  $ver = $db->prepare('SELECT actualizada FROM ideas WHERE id=?');
  $poner = $db->prepare('INSERT OR REPLACE INTO ideas (' . implode(',', $campos) . ') VALUES (' . rtrim(str_repeat('?,', count($campos)), ',') . ')');
  $db->beginTransaction();
  foreach ($ideas as $x) {
    if (!is_array($x) || !preg_match('/^[A-Za-z0-9_-]{1,40}$/', (string)($x['id'] ?? ''))) continue;
    $x['actualizada'] = (string)($x['actualizada'] ?? $x['creada'] ?? gmdate('c'));
    $ver->execute([$x['id']]);
    $ya = $ver->fetchColumn();
    if ($ya !== false && strcmp($ya, $x['actualizada']) >= 0) continue;
    if (!in_array($x['estado'] ?? 'pendiente', ['pendiente', 'hecha', 'descartada'], true)) $x['estado'] = 'pendiente';
    $fila = [];
    foreach ($campos as $c) {
      $v = $x[$c] ?? null;
      if ($c === 'borrada') $v = empty($v) ? 0 : 1;
      elseif ($v !== null) $v = mb_substr((string)$v, 0, $c === 'texto' || $c === 'nota' ? 8000 : 200);
      $fila[] = $v;
    }
    $poner->execute($fila);
  }
  if (isset($entrada['categorias']) && is_array($entrada['categorias'])) {
    $cats = array_values(array_slice(array_filter(array_map(fn($c) => mb_substr(trim((string)$c), 0, 40), $entrada['categorias'])), 0, 60));
    $db->prepare("INSERT OR REPLACE INTO ajustes (clave, valor) VALUES ('categorias', ?)")->execute([json_encode($cats, JSON_UNESCAPED_UNICODE)]);
  }
  $db->commit();
  salir(todo($db));
}

if ($accion === 'cambiarClave') {
  $c = (string)($entrada['nueva'] ?? '');
  if (mb_strlen($c) < 6) salir(['error' => 'La clave tiene que tener al menos 6 letras o números.'], 400);
  file_put_contents($archivoClave, password_hash($c, PASSWORD_DEFAULT), LOCK_EX);
  salir(['ok' => true]);
}

salir(['error' => 'Acción desconocida.'], 400);
