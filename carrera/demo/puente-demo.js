// Carrera de prueba (demo): arranca sola una carrera cortita a todo lo que da y al final invita a bajar el juego.
// La agrega armar_web.py demo al final de la página (carpeta web-demo/).
(() => {
  const PLAY = 'https://play.google.com/store/apps/details?id=com.ebogni.carreraenminiatura';
  document.documentElement.classList.add('en-demo');
  verPublicidad = (tipo, alTerminar) => alTerminar(true);          // la demo no muestra publicidad
  const estilo = document.createElement('style');
  estilo.textContent = `#demoFin{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(28,32,64,.72);padding:16px}
    #demoFin .tarjeta{text-align:center} #demoFin a{display:block;margin:10px auto 0;max-width:320px;text-decoration:none}
    #demoFin a button{width:100%} #demoFin h2{margin:0 0 6px}`;
  document.head.appendChild(estilo);
  function correr() {
    Object.assign(cfg, { modo: 'maquina', rivales: 3, nivel: 'dificil', pista: 'ocho', vueltas: 1, obstaculos: 'si', dano: 'si', vista: 'toda' });
    turboArranque = true; largar();
    setTimeout(() => avisos.push({ txt: _t('¡Ganale a los 3!'), t: 1.6 }), 400);
  }
  const terminarOriginal = terminar;
  terminar = function () {
    terminarOriginal();
    const humano = autos[0], gano = [...autos].sort(ordenCarrera)[0] === humano;
    setTimeout(() => {
      $('#fin').hidden = true;
      let d = document.getElementById('demoFin'); if (d) d.remove();
      d = document.createElement('div'); d.id = 'demoFin';
      d.innerHTML = `<div class="tarjeta"><h2>${gano ? _t('¡Ganaste! 🏆') : humano.roto ? _t('¡Tu auto explotó! 💥') : _t('¡Casi! 🏁')}</h2>
        <p>${_t('Esto fue una probadita. El juego completo tiene niveles infinitos, campeonatos, de a dos, pistas que dibujás vos y tu auto pintado a tu gusto.')}</p>
        <a href="${PLAY}"><button type="button" class="grande enorme">${_t('Bajalo gratis en Google Play')}</button></a>
        <button type="button" id="demoOtra" style="--c:var(--violeta);margin-top:10px">${_t('Otra carrera')}</button></div>`;
      document.body.appendChild(d);
      document.getElementById('demoOtra').onclick = () => { d.remove(); correr(); };
    }, gano ? 3200 : 1400);
  };
  // Arranca solo, sin menús.
  setTimeout(correr, 300);
})();
