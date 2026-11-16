# MARS: THE LAST OUTPOST

Juego 3D de supervivencia en Marte que se juega en el navegador.

## Cómo ejecutarlo
1. Abre `index.html` con doble clic (Chrome, Edge, Firefox o Safari).
2. Necesita internet para cargar Three.js y la tipografía.

## Controles
- Mover: WASD o flechas (en el móvil, los botones ▲ ◀ ▼ ▶).
- Actuar: tecla E o botón «Actuar».
- Cambiar de sala: camina hacia las puertas amarillas.

## Estructura
- `index.html`: página y elementos de la interfaz.
- `css/style.css`: estilos de la interfaz (HUD, tareas, ventanas).
- `js/game.js`: datos (NASA, escenarios, eventos), tareas, decisiones, ecos, comunicación diferida, informe final y movimiento.
- `js/world3d.js`: escena 3D con Three.js (salas, astronauta, cámara, flecha guía).

## Dónde editar
- Eventos y decisiones: constante `EV` en `js/game.js`.
- Datos NASA: constante `NASA`.
- Escenarios: constante `SCEN`.
- Salas, puertas y equipos: constante `SC`.
