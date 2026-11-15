#!/bin/bash
# Lo corre la tarea programada del servidor (Hostinger) CADA MINUTO. Junta los datos del tablero si:
# alguien tocó ↻ (refrescar.pedido) o pasaron 10 minutos desde la última vez. Nunca corre dos a la vez.
cd "$(dirname "$0")" || exit 1
L=ultimo.ok; P=refrescar.pedido
if [ -f "$P" ] || [ ! -f "$L" ] || [ $(( $(date +%s) - $(stat -c %Y "$L") )) -ge 600 ]; then
  exec 9>corriendo.lock; flock -n 9 || exit 0
  F=$(cat "$P" 2>/dev/null); rm -f "$P"
  echo "== $(date '+%F %T') ${F:-todo}" >> registro.txt
  FUENTE="$F" TABLERO_DIR="$HOME/domains/vikingzone.app/public_html/tablero" timeout 300 "$HOME/node/bin/node" --env-file=.env recolectar.mjs >> registro.txt 2>&1 && touch "$L"
  tail -n 400 registro.txt > registro.tmp && mv registro.tmp registro.txt
fi
