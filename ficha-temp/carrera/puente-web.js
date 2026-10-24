// Puente entre el juego y CrazyGames (versión web). Lo agrega armar_web.py al final de la página.
// Si el SDK no está (abierto desde el disco), el juego sigue igual que la maqueta.
(() => {
  const C = window.CrazyGames && window.CrazyGames.SDK;
  document.documentElement.classList.add('en-web');
  // CrazyGames tiene su propio botón de pantalla completa; las novedades son de la app.
  document.querySelectorAll('.btn-full').forEach(b => b.remove());
  const nov = document.getElementById('novedad'); if (nov) nov.remove();
  // Que las flechas y la barra no muevan la página del portal.
  addEventListener('keydown', e => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !/INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName)) e.preventDefault(); }, { passive: false });
  if (!C) return;
  let listo = false;
  try { C.game.loadingStart(); } catch (e) {}
  // El progreso (localStorage) lo guarda solo CrazyGames en la cuenta del jugador ("Automatic Progress Save").
  C.init().then(() => { listo = true; try { C.game.loadingStop(); } catch (e) {} }).catch(() => {});

  // --- Publicidad: 'pantalla' = anuncio entre carreras (midgame), 'video' = video con premio (rewarded) ---
  const original = verPublicidad;
  verPublicidad = function (tipo, alTerminar) {
    if (!listo || C.environment === 'disabled') return original(tipo, alTerminar);
    let fin = false;
    const terminar = ok => { if (fin) return; fin = true; try { Sonido.pausa(false); } catch (e) {} alTerminar(ok); };
    try { soltarTodo(); } catch (e) {}
    C.ad.requestAd(tipo === 'video' ? 'rewarded' : 'midgame', {
      adStarted: () => { try { Sonido.pausa(true); } catch (e) {} },
      adFinished: () => terminar(true),
      adError: () => { if (tipo === 'video') avisos.push({ txt: _t('No hay un video ahora. Probá en un ratito.'), t: 1.8 }); terminar(tipo !== 'video'); },
    });
  };

  // --- Avisar cuándo se está jugando (carrera o cuenta regresiva) y cuándo no (menús, pausa, fin) ---
  let jugando = false;
  setInterval(() => {
    const ahora = estado === 'carrera' || estado === 'cuenta';
    if (ahora === jugando || !listo) return;
    jugando = ahora;
    try { ahora ? C.game.gameplayStart() : C.game.gameplayStop(); } catch (e) {}
  }, 300);

  // --- Momentos de festejo grandes: salir campeón o llegar a los niveles altos ---
  const logro = Juegos.logro.bind(Juegos);
  Juegos.logro = id => { if (listo && ['campeon', 'nivel25', 'nivel50'].includes(id)) { try { C.game.happytime(); } catch (e) {} } return logro(id); };
})();
