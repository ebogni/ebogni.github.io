// Puente entre el juego y los portales web (CrazyGames o Y8, según window.PORTAL). Lo agrega armar_web.py al final de la página.
// Si el SDK no está (abierto desde el disco), el juego sigue igual que la maqueta.
(() => {
  const PORTAL = window.PORTAL || 'crazygames', IDS = window.PORTAL_IDS || {};
  const C = PORTAL === 'crazygames' && window.CrazyGames && window.CrazyGames.SDK;
  document.documentElement.classList.add('en-web');
  // CrazyGames tiene su propio botón de pantalla completa; las novedades son de la app.
  document.querySelectorAll('.btn-full').forEach(b => b.remove());
  const nov = document.getElementById('novedad'); if (nov) nov.remove();
  // Que las flechas y la barra no muevan la página del portal.
  addEventListener('keydown', e => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !/INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName)) e.preventDefault(); }, { passive: false });
  // En los portales se entra rápido a jugar: "Jugar" arranca directo el próximo nivel; los otros modos, en "Más modos".
  const jugar = document.getElementById('btnJugar');
  if (jugar) {
    const nuevo = jugar.cloneNode(true); jugar.replaceWith(nuevo);
    nuevo.addEventListener('click', () => empezarNivel(nivelMax()));
    const mas = document.createElement('button'); mas.type = 'button'; mas.id = 'btnMasModos'; mas.style.setProperty('--c', 'var(--naranja, #ff8a1f)'); mas.textContent = _t('Más modos');
    mas.addEventListener('click', () => mostrar('paso1')); nuevo.after(mas);
  }
  if (PORTAL === 'y8') { conY8(); return; }
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
      // Si no hay anuncio (o el portal todavía no los habilitó), el premio se da igual: el botón nunca queda muerto.
      adError: () => terminar(true),
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

  // --- Y8: anuncios con su SDK (start / next / reward). Sin IDs todavía, el juego anda igual sin anuncios. ---
  function conY8() {
    let sdk = null;
    const arrancar = () => { try { sdk = window.y8.sdk(); sdk.init({ appId: IDS.appId, autoLogin: false }, { gameId: IDS.gameId, preloadAdBreaks: 'on', sound: 'on', onReady: () => {} }); } catch (e) { sdk = null; } };
    if (IDS.gameId && IDS.appId) {
      if (window.y8 && window.y8.sdk) arrancar(); else window.addEventListener('y8sdk.ready', arrancar, { once: true });
    }
    const original = verPublicidad;
    verPublicidad = function (tipo, alTerminar) {
      if (!sdk) return tipo === 'video' ? alTerminar(true) : alTerminar(true);   // sin SDK: el premio se da igual
      let fin = false, premio = tipo !== 'video';
      const terminar = () => { if (fin) return; fin = true; try { Sonido.pausa(false); } catch (e) {} alTerminar(premio || tipo !== 'video'); };
      try { soltarTodo(); } catch (e) {}
      try {
        const p = sdk.showAd({ type: tipo === 'video' ? 'reward' : 'next', name: tipo === 'video' ? 'premio' : 'fin-carrera',
          beforeAd: () => { try { Sonido.pausa(true); } catch (e) {} },
          afterAd: () => {},
          beforeReward: mostrar => mostrar(),
          adDismissed: () => {},
          adViewed: () => { premio = true; },
          adBreakDone: info => { if (tipo === 'video' && info && /notReady|timeout|error|frequencyCapped|noAdPreloaded/i.test(info.breakStatus || '')) premio = true; terminar(); } });
        if (p && p.catch) p.catch(() => { premio = true; terminar(); });
      } catch (e) { premio = true; terminar(); }
      void original;
    };
  }
})();
