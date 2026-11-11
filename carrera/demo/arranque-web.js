// Arranque del juego en los portales web. Lo pone armar_web.py en el <head>, justo después del kit (SDK) del portal.
// 1) Inicia el kit del portal ANTES que el juego (Playgama lo exige).
// 2) Trae lo guardado del jugador (Playgama: bridge.storage; CrazyGames: SDK.data; Y8: el navegador) y se lo da al juego como window.ALMACEN.
// 3) Toma el idioma del portal (inglés si no hay otro que el juego tenga).
// 4) Recién ahí corre el juego (sus <script type="text/x-juego">) y después puente-web.js (publicidad, pausa, sonido).
(() => {
  const PORTAL = window.PORTAL || 'crazygames';
  const CLAVE = 'carrera-datos';           // Playgama: todo el progreso en una sola clave (un solo get al arrancar, un solo set por cambio)
  let datos = {}, timer = null, guardarRemoto = null;
  const programar = () => { if (!guardarRemoto) return; clearTimeout(timer); timer = setTimeout(guardarYa, 700); };
  const guardarYa = () => { clearTimeout(timer); timer = null; if (guardarRemoto) guardarRemoto(JSON.stringify(datos)); };
  window.ALMACEN = {
    get: k => (Object.prototype.hasOwnProperty.call(datos, k) ? datos[k] : null),
    set: (k, v) => { v = String(v); if (datos[k] === v) return; datos[k] = v; programar(); },
  };
  // Si el jugador cierra o esconde la pestaña con algo pendiente, se guarda en el momento.
  addEventListener('visibilitychange', () => { if (document.hidden && timer) guardarYa(); });
  addEventListener('pagehide', () => { if (timer) guardarYa(); });
  window.PUBLI_SIEMPRE = PORTAL === 'playgama';  // Playgama: pedir publicidad en cada pausa natural; el Bridge decide cuándo mostrarla

  const idiomaDe = l => { l = String(l || '').toLowerCase(); return l.startsWith('es') ? 'es' : l.startsWith('pt') ? 'pt-BR' : 'en'; };

  async function conPlaygama() {
    const B = window.bridge;
    if (!B) { window.IDIOMA_PORTAL = 'en'; return; }   // abierto desde el disco: anda sin guardar
    await B.initialize();
    window.IDIOMA_PORTAL = idiomaDe(B.platform.language);
    try {
      const r = await B.storage.get([CLAVE]);
      let v = Array.isArray(r) ? r[0] : r && r[CLAVE];
      if (typeof v === 'string') v = JSON.parse(v);
      if (v && typeof v === 'object') datos = v;
    } catch (e) {}
    guardarRemoto = txt => { try { B.storage.set([CLAVE], [txt]).catch(() => {}); } catch (e) {} };
  }

  async function conCrazyGames() {
    const C = window.CrazyGames && window.CrazyGames.SDK;
    const local = () => { guardarRemoto = null; window.ALMACEN.set = (k, v) => { datos[k] = String(v); try { localStorage.setItem(k, String(v)); } catch (e) {} }; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('carrera-')) datos[k] = localStorage.getItem(k); } };
    if (!C) { window.IDIOMA_PORTAL = navigator.language; try { local(); } catch (e) {} return; }
    try { C.game.loadingStart(); } catch (e) {}
    await C.init();
    try { window.IDIOMA_PORTAL = idiomaDe((C.user.systemInfo || {}).locale || navigator.language); } catch (e) { window.IDIOMA_PORTAL = 'en'; }
    const D = C.data;
    if (!D) { try { local(); } catch (e) {} return; }
    let v = null; try { v = D.getItem(CLAVE); v = v && JSON.parse(v); } catch (e) { v = null; }
    if (v && typeof v === 'object') datos = v;
    else {  // primera vez con el guardado de CrazyGames: traer lo que ya tenía el jugador en este navegador
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('carrera-')) datos[k] = localStorage.getItem(k); } } catch (e) {}
    }
    guardarRemoto = txt => { try { D.setItem(CLAVE, txt); } catch (e) {} };
    if (Object.keys(datos).length) guardarYa();
  }

  function conNavegador() {  // Y8 (y la demo): se guarda en el navegador, clave por clave, como siempre
    window.IDIOMA_PORTAL = navigator.language;
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('carrera-')) datos[k] = localStorage.getItem(k); } } catch (e) {}
    window.ALMACEN.set = (k, v) => { datos[k] = String(v); try { localStorage.setItem(k, String(v)); } catch (e) {} };
  }

  const preparar = PORTAL === 'playgama' ? conPlaygama : PORTAL === 'crazygames' ? conCrazyGames : async () => conNavegador();
  // Si el kit del portal no contesta, el juego arranca igual a los 8 segundos (nunca queda la pantalla en blanco).
  const listo = Promise.race([preparar().catch(() => {}), new Promise(r => setTimeout(r, 8000))]);

  const correrJuego = () => {
    document.querySelectorAll('script[type="text/x-juego"]').forEach(v => { const s = document.createElement('script'); s.textContent = v.textContent; v.replaceWith(s); });
    const siguiente = lista => { if (!lista.length) return; const p = document.createElement('script'); p.src = lista[0]; p.onload = p.onerror = () => siguiente(lista.slice(1)); document.body.appendChild(p); };
    siguiente(window.PUENTES || ['puente-web.js']);
  };
  const cuandoHayPagina = new Promise(r => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', r, { once: true }) : r());
  Promise.all([listo, cuandoHayPagina]).then(correrJuego);
})();
