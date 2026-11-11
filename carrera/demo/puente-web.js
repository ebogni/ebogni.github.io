// Puente entre el juego y los portales web (CrazyGames, Y8 o Playgama, según window.PORTAL).
// Lo carga arranque-web.js cuando el juego ya corrió (el kit del portal ya está iniciado y lo guardado ya está cargado).
// Si el kit no está (abierto desde el disco), el juego sigue igual que la maqueta, sin anuncios.
(() => {
  const PORTAL = window.PORTAL || 'crazygames', IDS = window.PORTAL_IDS || {};
  const html = document.documentElement;
  html.classList.add('en-web');
  // Los portales tienen su propio botón de pantalla completa; las novedades son de la app.
  document.querySelectorAll('.btn-full').forEach(b => b.remove());
  const nov = document.getElementById('novedad'); if (nov) nov.remove();
  // Sin botones de video donde el portal no da videos con premio.
  const css = document.createElement('style');
  css.textContent = 'html.sin-video #btnReparar, html.sin-video #btnRevTurbo, html.sin-video #btnSaltarNivel{display:none!important}';
  document.head.appendChild(css);
  // Que las flechas y la barra no muevan la página del portal.
  addEventListener('keydown', e => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !/INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName)) e.preventDefault(); }, { passive: false });
  // En los portales se entra rápido a jugar: "Jugar" arranca directo el próximo nivel; los otros modos, en "Más modos".
  const jugar = document.getElementById('btnJugar');
  if (jugar) {
    const nuevo = jugar.cloneNode(true); jugar.replaceWith(nuevo);
    nuevo.addEventListener('click', () => empezarNivel(nivelMax()));
    const mas = document.createElement('button'); mas.type = 'button'; mas.id = 'btnMasModos'; mas.className = 'tile'; mas.style.setProperty('--c', 'var(--naranja, #ff8a1f)'); mas.innerHTML = '<img class="ico-png" src="imagenes/ui-elegir-nivel.webp" alt="" aria-hidden="true" draggable="false"><span></span>'; mas.querySelector('span').textContent = _t('Más modos');
    mas.addEventListener('click', () => mostrar('paso1')); nuevo.after(mas);
  }

  // --- Sonido: suena solo si el juego quiere, el portal lo permite, no hay anuncio y la pestaña está a la vista ---
  const porJuego = Sonido.pausa.bind(Sonido);
  const silencio = { juego: false, portal: false, portalPausa: false, anuncio: false, oculto: document.hidden };
  const aplicarSonido = () => porJuego(silencio.juego || silencio.portal || silencio.portalPausa || silencio.anuncio || silencio.oculto);
  Sonido.pausa = on => { silencio.juego = !!on; aplicarSonido(); };
  const silenciar = (motivo, on) => { silencio[motivo] = !!on; aplicarSonido(); };
  addEventListener('visibilitychange', () => { silenciar('oculto', document.hidden); if (document.hidden) { try { pausar(); } catch (e) {} } });
  aplicarSonido();
  const jugando = () => estado === 'carrera' || estado === 'cuenta';

  // --- Encadenar carreras: al terminar, el botón principal cuenta 5 (o 8) segundos y arranca solo la siguiente. ---
  // Cualquier toque o tecla frena la cuenta. Solo en la web (en los portales juegan sesiones cortas: así juegan más seguido).
  (() => {
    const fin = document.getElementById('fin'); if (!fin) return;
    let timer = null, base = '', boton = null;
    const parar = () => { if (timer) { clearInterval(timer); timer = null; } if (boton && base) boton.textContent = base; boton = null; };
    new MutationObserver(() => {
      if (fin.hidden) { parar(); return; }
      if (timer) return;
      const sig = document.getElementById('btnSiguiente'), rev = document.getElementById('btnRevancha');
      boton = sig && !sig.hidden ? sig : rev && !rev.hidden ? rev : null; if (!boton) return;
      base = boton.textContent; let n = boton === sig ? 5 : 8;
      boton.textContent = base + ' (' + n + ')';
      timer = setInterval(() => { n--; if (!boton) return; if (n <= 0) { const b = boton; parar(); if (!fin.hidden) b.click(); } else boton.textContent = base + ' (' + n + ')'; }, 1000);
    }).observe(fin, { attributes: true, attributeFilter: ['hidden'] });
    ['pointerdown', 'keydown', 'wheel'].forEach(ev => addEventListener(ev, e => { if (timer && !(boton && boton.contains(e.target))) parar(); }, { capture: true }));
  })();

  if (PORTAL === 'playgama') return conPlaygama();
  if (PORTAL === 'y8') return conY8();
  conCrazyGames();

  // --- Playgama (Bridge): un solo kit que también sirve para sus portales asociados ---
  function conPlaygama() {
    const B = window.bridge;
    if (!B) { verPublicidad = (tipo, alTerminar) => alTerminar(tipo !== 'video'); html.classList.add('sin-video'); return; }
    const E = B.EVENT_NAME;
    // Al arrancar: si el portal tiene el sonido apagado, el juego queda mudo (también después de recargar).
    try { silenciar('portal', B.platform.isAudioEnabled === false); } catch (e) {}
    try { B.platform.on(E.AUDIO_STATE_CHANGED, on => silenciar('portal', !on)); } catch (e) {}
    try { B.platform.on(E.PAUSE_STATE_CHANGED, p => { silenciar('portalPausa', p); if (p) { try { pausar(); } catch (e) {} } }); } catch (e) {}
    const conVideo = !!B.advertisement.isRewardedSupported;
    if (!conVideo) html.classList.add('sin-video');

    // Avisos de juego (nivel empezado, en pausa, retomado) para las estadísticas del portal.
    let antes = '';
    setInterval(() => {
      const ahora = jugando() ? 'jugando' : String(estado).startsWith('pausa') ? 'pausa' : 'menu';
      if (ahora === antes) return;
      const msg = ahora === 'jugando' ? (antes === 'pausa' ? 'level_resumed' : 'level_started') : ahora === 'pausa' && antes === 'jugando' ? 'level_paused' : null;
      antes = ahora;
      if (msg) { try { B.platform.sendMessage(msg); } catch (e) {} }
    }, 300);

    // Publicidad. 'pantalla' = interstitial en cada pausa natural (fin de carrera, reintento): el Bridge decide si la muestra.
    // 'video' = video con premio: el premio se da SOLO si el estado llega a 'rewarded'.
    verPublicidad = function (tipo, alTerminar) {
      const video = tipo === 'video';
      if (video && !conVideo) return alTerminar(true);        // botones escondidos; lo que quede (calcos del taller) se abre igual
      let fin = false, abrio = false, premio = false, espera = null;
      const ev = video ? E.REWARDED_STATE_CHANGED : E.INTERSTITIAL_STATE_CHANGED;
      const terminar = () => {
        if (fin) return; fin = true; clearTimeout(espera);
        try { B.advertisement.off && B.advertisement.off(ev, alCambiar); } catch (e) {}
        silenciar('anuncio', false);
        alTerminar(video ? premio : true);
      };
      const alCambiar = st => {
        if (st === 'loading' || st === 'opened') { abrio = true; clearTimeout(espera); }
        if (st === 'opened') silenciar('anuncio', true);
        if (st === 'rewarded') premio = true;
        if (st === 'closed' || st === 'failed') terminar();
      };
      try { soltarTodo(); } catch (e) {}
      try {
        B.advertisement.on(ev, alCambiar);
        if (video) B.advertisement.showRewarded(); else B.advertisement.showInterstitial();
        // Si el Bridge decide no mostrar nada (todavía es temprano o hace poco hubo otro), el juego sigue solo.
        espera = setTimeout(() => { if (!abrio) terminar(); }, video ? 4000 : 900);
      } catch (e) { terminar(); }
    };
    // Listo para jugar: el menú ya está en pantalla.
    requestAnimationFrame(() => { try { B.platform.sendMessage('game_ready'); } catch (e) {} });
  }

  // --- CrazyGames: el SDK ya se inició en arranque-web.js ---
  function conCrazyGames() {
    const C = window.CrazyGames && window.CrazyGames.SDK;
    if (!C || C.environment === 'disabled') { verPublicidad = (tipo, alTerminar) => alTerminar(true); return; }
    try { C.game.loadingStop(); } catch (e) {}
    try {
      if (C.game.settings && C.game.settings.muteAudio) silenciar('portal', true);
      if (C.game.addSettingsChangeListener) C.game.addSettingsChangeListener(s => silenciar('portal', !!(s && s.muteAudio)));
    } catch (e) {}
    verPublicidad = function (tipo, alTerminar) {
      const video = tipo === 'video';
      let fin = false;
      const terminar = ok => { if (fin) return; fin = true; silenciar('anuncio', false); alTerminar(ok); };
      try { soltarTodo(); } catch (e) {}
      try {
        C.ad.requestAd(video ? 'rewarded' : 'midgame', {
          adStarted: () => silenciar('anuncio', true),
          adFinished: () => terminar(true),
          adError: () => terminar(!video),   // sin anuncio: el juego sigue, pero el premio no se regala
        });
      } catch (e) { terminar(!video); }
    };
    // Avisar cuándo se está jugando (carrera o cuenta regresiva) y cuándo no (menús, pausa, fin).
    let antes = false;
    setInterval(() => {
      const ahora = jugando(); if (ahora === antes) return; antes = ahora;
      try { ahora ? C.game.gameplayStart() : C.game.gameplayStop(); } catch (e) {}
    }, 300);
    // Momentos de festejo grandes: salir campeón o llegar a los niveles altos.
    const logro = Juegos.logro.bind(Juegos);
    Juegos.logro = id => { if (['campeon', 'nivel25', 'nivel50'].includes(id)) { try { C.game.happytime(); } catch (e) {} } return logro(id); };
  }

  // --- Y8: anuncios con su SDK (start / next / reward). Sin IDs todavía, el juego anda igual sin anuncios. ---
  function conY8() {
    let sdk = null;
    const arrancar = () => { try { sdk = window.y8.sdk(); sdk.init({ appId: IDS.appId, autoLogin: false }, { gameId: IDS.gameId, preloadAdBreaks: 'on', sound: 'on', onReady: () => {} }); } catch (e) { sdk = null; } };
    if (IDS.gameId && IDS.appId) {
      if (window.y8 && window.y8.sdk) arrancar(); else window.addEventListener('y8sdk.ready', arrancar, { once: true });
    }
    verPublicidad = function (tipo, alTerminar) {
      const video = tipo === 'video';
      if (!sdk) return alTerminar(true);   // sin SDK todavía: el juego anda igual
      let fin = false, premio = false;
      const terminar = () => { if (fin) return; fin = true; silenciar('anuncio', false); alTerminar(video ? premio : true); };
      try { soltarTodo(); } catch (e) {}
      try {
        const p = sdk.showAd({ type: video ? 'reward' : 'next', name: video ? 'premio' : 'fin-carrera',
          beforeAd: () => silenciar('anuncio', true),
          afterAd: () => {},
          beforeReward: mostrar => mostrar(),
          adDismissed: () => {},
          adViewed: () => { premio = true; },
          adBreakDone: () => terminar() });
        if (p && p.catch) p.catch(() => terminar());
      } catch (e) { terminar(); }
    };
  }
})();
