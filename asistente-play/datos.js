// Datos de cada app para el asistente de Play Console. Lo arma Claude; una entrada por app.
// Orden y nombres según el Panel de Play Console (revisado el 13/11/2026).
// La cuenta de Emanuel es anterior a noviembre de 2023: no necesita prueba cerrada con 12 verificadores.
window.APPS = {
 "tatamigo": {
  "nombre": "TatamiGo",
  "paquete": "com.ebogni.tatamigo",
  "carpetaPC": "F:\\Progamacion\\Android\\01 - Apps\\DOJO",
  "pasos": [
   {
    "titulo": "Crear la app",
    "bloque": "Todas las apps",
    "donde": "Play Console → Todas las apps → Crear app",
    "campos": [
     [
      "Nombre de la app",
      "TatamiGo: Academias y Dojos"
     ],
     [
      "Nombre del paquete",
      "com.ebogni.tatamigo"
     ],
     [
      "Idioma predeterminado",
      "Español (Latinoamérica) – es-419",
      false
     ],
     [
      "App o juego",
      "Aplicación",
      false
     ],
     [
      "Gratuita o pagada",
      "Gratis",
      false
     ]
    ],
    "nota": "Tildá las dos declaraciones (políticas y leyes de exportación) y tocá Crear app."
   },
   {
    "titulo": "Configurar: política de privacidad",
    "donde": "Panel → \"Brinda información sobre la app…\" → Ver tareas → Configura la política de privacidad",
    "campos": [
     [
      "URL",
      "https://tatamigo.vikingzone.app/privacidad.html"
     ]
    ],
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Configurar: detalles de acceso",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Detalles de acceso",
    "campos": [
     [
      "¿Alguna parte de tu app está restringida?",
      "Sí",
      false
     ],
     [
      "Tocar",
      "+ Agrega detalles",
      false
     ],
     [
      "Nombre",
      "Google sign-in"
     ],
     [
      "Nombre de usuario y Contraseña",
      "Dejarlos vacíos (se entra con cualquier cuenta de Google)",
      false
     ],
     [
      "Cualquier otra información necesaria (en inglés)",
      "Sign in with ANY Google account (button \"Continue with Google\"); there is no separate username or password. To test everything: 1) Sign in, choose \"I'm a coach\" and create a test academy. 2) For the student view, sign in with a second Google account, choose \"I'm a student\" and enter the academy code shown on the coach's home screen. QR attendance needs to be at the academy's location; the coach can also mark attendance manually."
     ],
     [
      "Casilla al final",
      "Tildar \"Los detalles de acceso… proporcionan acceso completo…\"",
      false
     ]
    ],
    "nota": "Tocá Agregar y después Guardar (abajo a la derecha)."
   },
   {
    "titulo": "Configurar: anuncios",
    "donde": "Panel → Anuncios",
    "campos": [
     [
      "¿Tu app contiene anuncios?",
      "No, mi app no contiene anuncios",
      false
     ]
    ],
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Configurar: clasificación de contenido",
    "donde": "Panel → Clasificación de contenido (pasos: 1 Categoría · 2 Cuestionario · 3 Resumen)",
    "campos": [
     [
      "## Categoría",
      "",
      false
     ],
     [
      "Categoría elegida",
      "El resto de los tipos de app",
      false
     ],
     [
      "Correo electrónico (si lo pide)",
      "ebogni@gmail.com"
     ],
     [
      "Términos y Condiciones",
      "Tildar: Acepto las Condiciones de Uso que describe la Coalición Internacional de Calificación por Edad (IARC).",
      false
     ],
     [
      "## Cuestionario — App descargada",
      "",
      false
     ],
     [
      "¿La app contiene algún tipo de contenido relevante para la calificación (p. ej., sexo, violencia, lenguaje) que se descarga como parte del paquete de la app (código, elementos)?",
      "No",
      false
     ],
     [
      "## Cuestionario — Uso compartido del contenido del usuario",
      "",
      false
     ],
     [
      "¿La app permite de forma nativa que los usuarios interactúen o intercambien contenido con otros usuarios mediante mensajes de voz o de texto, o que compartan imágenes o audio?",
      "Sí",
      false
     ],
     [
      "¿El contenido compartido y generado por usuarios es la fuente principal de contenido en la app?",
      "No",
      false
     ],
     [
      "¿La app permite compartir imágenes de desnudos con el público?",
      "No",
      false
     ],
     [
      "¿La app permite que el público comparta contenido de violencia gráfica real fuera de un contexto noticioso?",
      "No",
      false
     ],
     [
      "¿La app incluye la posibilidad de bloquear usuarios o contenido generado por usuarios?",
      "No",
      false
     ],
     [
      "¿La app incluye la posibilidad de denunciar a usuarios o contenido generado por usuarios?",
      "Sí",
      false
     ],
     [
      "¿La app incluye la moderación de chats?",
      "Sí",
      false
     ],
     [
      "¿Las interacciones de la app se pueden limitar solo a amigos invitados?",
      "Sí",
      false
     ],
     [
      "## Cuestionario — Contenido en línea",
      "",
      false
     ],
     [
      "(preguntas pendientes: pasáselas a Claude tal cual)",
      "",
      false
     ],
     [
      "## Cuestionario — Promoción o venta de productos o actividades con restricción de edad",
      "",
      false
     ],
     [
      "(preguntas pendientes: pasáselas a Claude tal cual)",
      "",
      false
     ],
     [
      "## Cuestionario — Varios",
      "",
      false
     ],
     [
      "(preguntas pendientes: pasáselas a Claude tal cual)",
      "",
      false
     ],
     [
      "## Resumen",
      "",
      false
     ],
     [
      "Qué hacer",
      "Revisar y enviar",
      false
     ]
    ],
    "nota": "Textos tal cual los muestra Play Console. Lo marcado como pendiente se completa cuando Emanuel lo pase.",
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Configurar: público objetivo",
    "donde": "Panel → Público objetivo",
    "campos": [
     [
      "Grupos de edad objetivo",
      "Tildar solo: 18 años o más",
      false
     ],
     [
      "¿La app podría atraer a niños sin querer?",
      "No",
      false
     ]
    ],
    "nota": "Los menores entran con permiso de su adulto, pero la app está pensada para profes y adultos. Si marcás menores de 13, entra en las reglas de Familias (mucho más estrictas).",
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Configurar: seguridad de los datos",
    "bloque": "Configura la app",
    "donde": "Panel → Contenido de la app → Seguridad de los datos (5 pasos)",
    "campos": [
     [
      "## Paso 1: Descripción general",
      "Solo se lee. Tocá Siguiente.",
      false
     ],
     [
      "## Paso 2: Seguridad y recopilación de datos",
      "",
      false
     ],
     [
      "¿Tu app recopila o comparte alguno de los tipos de datos que se requieren de los usuarios?",
      "Sí",
      false
     ],
     [
      "¿Todos los datos de los usuarios que recopila tu app se encriptan en tránsito?",
      "Sí",
      false
     ],
     [
      "¿Cuál de los siguientes métodos de creación de cuentas admite la app?",
      "OAuth",
      false
     ],
     [
      "URL de eliminación de cuenta",
      "https://tatamigo.vikingzone.app/borrar-cuenta.html",
      true
     ],
     [
      "¿Pones a disposición una forma de borrar parte de los datos sin borrar la cuenta? (Opcional)",
      "Sin responder",
      false
     ],
     [
      "Insignias adicionales",
      "Ninguna",
      false
     ],
     [
      "## Paso 3: Tipos de datos (la página abre una categoría por vez)",
      "",
      false
     ],
     [
      "Información personal",
      "Nombre · Dirección de correo electrónico · ID de usuario · Número de teléfono · Otra información",
      false
     ],
     [
      "Información financiera",
      "Otra información financiera",
      false
     ],
     [
      "Mensajes",
      "Otros mensajes desde la app",
      false
     ],
     [
      "Fotos y videos",
      "Fotos",
      false
     ],
     [
      "Actividad en apps",
      "Interacciones en la app · Otro contenido generado por usuarios",
      false
     ],
     [
      "Dispositivo u otros IDs",
      "Dispositivo u otros IDs",
      false
     ],
     [
      "## Paso 4: Uso y manejo de datos (botón Comenzar en cada tipo)",
      "En TODOS: marcá Recopilados (NO Compartidos) y «No, los datos recopilados no se procesan de forma efímera».",
      false
     ],
     [
      "Nombre, Correo, ID de usuario",
      "La recopilación de datos es necesaria · Funciones de la app + Administración de la cuenta",
      false
     ],
     [
      "Número de teléfono, Otra información",
      "Los usuarios pueden decidir si los datos se recopilan o no · Funciones de la app",
      false
     ],
     [
      "Otra información financiera",
      "La recopilación de datos es necesaria · Funciones de la app",
      false
     ],
     [
      "Otros mensajes desde la app",
      "Los usuarios pueden decidir · Funciones de la app",
      false
     ],
     [
      "Fotos",
      "Los usuarios pueden decidir · Funciones de la app",
      false
     ],
     [
      "Interacciones en la app",
      "La recopilación de datos es necesaria · Funciones de la app",
      false
     ],
     [
      "Otro contenido generado por usuarios",
      "Los usuarios pueden decidir · Funciones de la app",
      false
     ],
     [
      "Dispositivo u otros IDs",
      "Los usuarios pueden decidir · Funciones de la app + Comunicaciones del desarrollador",
      false
     ],
     [
      "## Paso 5: Vista previa",
      "Tiene que decir «No se comparten datos con terceros», «Los datos están encriptados en tránsito» y la Política de Privacidad. Tocá Guardar.",
      false
     ]
    ],
    "nota": "Al guardar sale: «Se guardó el cambio. Envíalo a revisión en Descripción general de la publicación.»"
   },
   {
    "titulo": "Configurar: ID de publicidad",
    "bloque": "Configura la app",
    "donde": "Panel → Contenido de la app → ID de publicidad",
    "campos": [
     [
      "¿Tu app usa un ID de publicidad? (incluye los SDK que importa la app)",
      "No",
      false
     ]
    ],
    "nota": "Tocá Guardar."
   },
   {
    "titulo": "Configurar: apps gubernamentales",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Apps gubernamentales",
    "campos": [
     [
      "¿Un Gobierno o alguien en nombre de un Gobierno desarrolló tu app?",
      "No",
      false
     ]
    ]
   },
   {
    "titulo": "Configurar: funciones financieras",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Funciones financieras",
    "campos": [
     [
      "## Paso 1: Funciones financieras de tu app",
      "Marcá «Mi app no ofrece ninguna función financiera» y tocá Siguiente.",
      false
     ],
     [
      "## Paso 2: Documentación",
      "Dice que no hace falta documentación. Tocá Guardar.",
      false
     ]
    ],
    "nota": "Revisar cuando se agregue Mercado Pago."
   },
   {
    "titulo": "Configurar: salud",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Salud",
    "campos": [
     [
      "## Paso 1: Funciones de salud de tu app",
      "Marcá «Ninguna función de salud» y tocá Siguiente.",
      false
     ],
     [
      "## Paso 2: Requisitos regionales",
      "Dice que no hace falta nada. Tocá Guardar.",
      false
     ]
    ]
   },
   {
    "titulo": "Configurar: estado del comerciante",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Estado del comerciante",
    "campos": [
     [
      "¿Tu estado de comerciante se aplica a esta app?",
      "Sí, mi estado de comerciante se aplica a esta app",
      false
     ],
     [
      "Condiciones del Servicio (URL)",
      "https://tatamigo.vikingzone.app/terminos.html",
      true
     ]
    ],
    "nota": "Tocá Guardar. La cuenta ya está declarada como de comerciante."
   },
   {
    "titulo": "Configurar: categoría y contacto",
    "donde": "Panel → Selecciona la categoría de app y proporciona detalles de contacto (Configuración de la tienda)",
    "campos": [
     [
      "## Categoría de app (editar)",
      "",
      false
     ],
     [
      "App o juego",
      "Aplicación",
      false
     ],
     [
      "Categoría",
      "Deportes",
      false
     ],
     [
      "Etiquetas",
      "Opcional (hay «Artes marciales»)",
      false
     ],
     [
      "## Detalles de contacto de la ficha de Play Store (editar)",
      "",
      false
     ],
     [
      "Dirección de correo electrónico",
      "ebogni@gmail.com",
      true
     ],
     [
      "Número de teléfono",
      "Vacío (opcional)",
      false
     ],
     [
      "Sitio web",
      "https://tatamigo.vikingzone.app",
      true
     ]
    ],
    "bloque": "Panel → Configura la app (12 tareas)",
    "nota": "Cada bloque se guarda con su propio botón Guardar."
   },
   {
    "titulo": "Configurar: ficha de Play Store",
    "donde": "Fichas de Play Store → Crear ficha de Play Store predeterminada (idioma es-419)",
    "campos": [
     [
      "Nombre",
      "TatamiGo: Academias y Dojos"
     ],
     [
      "Descripción breve",
      "Asistencia con QR, cuotas y avisos para tu academia de artes marciales."
     ],
     [
      "Descripción completa",
      "TatamiGo es la app para academias de artes marciales: jiu jitsu, judo, karate, taekwondo, muay thai y más. El profe maneja todo desde el celular y sus alumnos se enteran de todo en el suyo.\n\nPARA EL PROFE\n• Alumnos con su cinturón, grados, disciplina y contacto. Los menores, con los datos de su adulto responsable.\n• Asistencia con QR: imprimí el código de tu academia y los alumnos se anotan solos al llegar. Solo cuenta si están en el dojo y en horario de clase.\n• Cuotas: quién pagó, quién debe y cuánto juntaste en el mes. Marcá pagos en efectivo o por transferencia.\n• Tablón: comunicados para toda la academia y preguntas de tus alumnos.\n• ¿Se suspende una clase? Avisás con un toque y a todos les llega la notificación.\n• Biblioteca: reglamentos, programa de exámenes y videos de técnicas.\n• Álbum de torneos y medallas.\n\nPARA EL ALUMNO\n• Escaneá el QR y quedás presente.\n• Tu próxima clase, tus clases del mes y tu cuota.\n• Avisos del profe, respuestas a tus preguntas y festejos por cada cinturón y medalla.\n\nCUIDAMOS A LOS CHICOS\nLas fotos de menores se suben solo con permiso de su madre, padre o tutor, que lo da desde un link por WhatsApp y lo puede sacar cuando quiera. Las fotos no son públicas: solo se ven dentro de la academia.\n\nEntrás con tu cuenta de Google, sin contraseñas. Tres temas de colores para tu academia. En español, inglés y portugués.\n\n¿Ideas o algo que no anda? Tocá la lamparita de Sugerencias dentro de la app."
     ],
     [
      "Ícono (512x512)",
      "F:\\Progamacion\\Android\\01 - Apps\\DOJO\\Diseño\\Dibujos\\icono-c.png",
      false
     ],
     [
      "Gráfico de funciones (1024x500)",
      "F:\\Progamacion\\Android\\01 - Apps\\DOJO\\Diseño\\Dibujos\\grafico-play-es.png",
      false
     ],
     [
      "Capturas del teléfono",
      "F:\\Progamacion\\Android\\01 - Apps\\DOJO\\Ficha Play Store\\capturas\\es-419 (las 6)",
      false
     ],
     [
      "## Imágenes (hay que subirlas a mano)",
      "",
      false
     ],
     [
      "Ícono de la app",
      "icono-512.png (512×512; está en Ficha Play Store; si hace falta otro: iconos.py --directo)",
      false
     ],
     [
      "Gráfico de funciones",
      "grafico-play-es.png (1024×500)",
      false
     ],
     [
      "Capturas de teléfono (2 a 8)",
      "Ficha Play Store\\capturas\\es-419\\1.png a 6.png",
      false
     ],
     [
      "Video (opcional, es-419)",
      "https://www.youtube.com/watch?v=lOwbgdBLuE4",
      true
     ],
     [
      "Videos en otros idiomas (para sus fichas traducidas)",
      "en: https://www.youtube.com/watch?v=Hn303zRBETg · pt-BR: https://www.youtube.com/watch?v=7Oh2mGKL958",
      false
     ]
    ],
    "nota": "Los textos ya los dejó cargados Claude como borrador. Faltan las imágenes: «Agregar recursos» → elegí el archivo. Después Siguiente (paso 2 Opinión) y Guardar.",
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Producción: subir y mandar a revisión",
    "bloque": "Panel → Lanza la app → Crea y publica una versión",
    "donde": "Menú izquierdo → Probar y lanzar → Producción → Crear versión nueva (se habilita cuando están las 12 tareas)",
    "campos": [
     [
      "Países (pestaña Países/regiones)",
      "Agregar países: Argentina como mínimo (o todos los que quieras)",
      false
     ],
     [
      "Firma de apps",
      "Si pregunta: \"Usar la clave generada por Google\" (la recomendada)",
      false
     ],
     [
      "Archivo para subir (Paquetes de aplicación → Subir)",
      "F:\\Progamacion\\Android\\01 - Apps\\DOJO\\Compilados\\TatamiGo-v1.aab"
     ],
     [
      "Nombre de la versión",
      "1 (se completa solo)",
      false
     ],
     [
      "Notas de la versión",
      "<es-419>\nPrimera versión: asistencia con QR, cuotas, tablón, avisos de clases suspendidas, biblioteca, torneos y medallas.\n</es-419>"
     ]
    ],
    "nota": "Siguiente → revisar que no haya errores → Guardar → \"Enviar cambios a revisión\" (en Descripción general de la publicación). Tu cuenta es anterior a noviembre de 2023: no hace falta prueba cerrada ni los 12 verificadores. Las versiones siguientes las sube Claude solo."
   },
   {
    "titulo": "Huella de la firma de Google (para Claude)",
    "bloque": "Después de subir la versión",
    "donde": "Menú izquierdo → Probar y lanzar → Integridad de la app → Firma de apps (o Configuración de la firma de apps)",
    "campos": [],
    "nota": "Copiá el \"Certificado SHA-256\" de la CLAVE DE FIRMA DE APPS (no la de subida) y pegáselo a Claude en el chat."
   }
  ]
 }
};
