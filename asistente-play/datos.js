// Datos de cada app para el asistente de Play Console. Lo arma Claude; una entrada por app.
// Orden y nombres según el Panel de Play Console (revisado el 13/11/2026).
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
    "titulo": "Prueba interna: seleccionar verificadores",
    "bloque": "Panel → Comienza las pruebas ahora",
    "donde": "Panel → \"Lanza la app de forma anticipada para realizar pruebas internas\" → Ver tareas → Seleccionar verificadores",
    "campos": [
     [
      "Qué hacer",
      "Crear una lista de correos (por ejemplo \"Yo\") con tu mail, y tildarla",
      false
     ],
     [
      "Nombre de la lista",
      "Yo"
     ],
     [
      "Correo",
      "ebogni@gmail.com"
     ]
    ],
    "nota": "La prueba interna no pasa por revisión: sirve para probarla ya en tu celu desde Play."
   },
   {
    "titulo": "Prueba interna: crear la versión",
    "bloque": "Panel → Comienza las pruebas ahora",
    "donde": "Panel → misma tarjeta → Crea una nueva versión",
    "campos": [
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
    "nota": "Tocá Siguiente → Guardar y publicar (en la prueba interna \"publicar\" solo la habilita para tus verificadores). Las versiones siguientes las sube Claude solo."
   },
   {
    "titulo": "Huella de la firma de Google (para Claude)",
    "bloque": "Panel → Comienza las pruebas ahora",
    "donde": "Menú izquierdo → Probar y lanzar → Integridad de la app → Firma de apps (o Configuración de la firma de apps)",
    "campos": [],
    "nota": "Copiá el \"Certificado SHA-256\" de la CLAVE DE FIRMA DE APPS (no la de subida) y pegáselo a Claude en el chat."
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
    "donde": "Panel → Clasificación de contenido → Iniciar cuestionario",
    "campos": [
     [
      "Correo electrónico",
      "(el tuyo de desarrollador)",
      false
     ],
     [
      "Categoría",
      "Todos los demás tipos de apps (no es juego, ni red social de referencia, ni tienda)",
      false
     ],
     [
      "Violencia, sexo, lenguaje, drogas, apuestas, miedo",
      "No a todo",
      false
     ],
     [
      "¿Los usuarios pueden interactuar o intercambiar contenido?",
      "Sí (tablón de avisos y preguntas, fotos de la academia)",
      false
     ],
     [
      "¿Comparte la ubicación del usuario con otros?",
      "No",
      false
     ],
     [
      "¿Compras digitales?",
      "No",
      false
     ],
     [
      "¿Contenido generado por usuarios sin moderar?",
      "Responder lo que pregunte: el profe modera su academia y se puede pedir que se borre una foto",
      false
     ]
    ],
    "nota": "Terminá y tocá Guardar → Enviar.",
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
    "donde": "Panel → Seguridad de los datos",
    "campos": [
     [
      "¿Recopila o comparte datos?",
      "Sí",
      false
     ],
     [
      "¿Datos encriptados en tránsito?",
      "Sí",
      false
     ],
     [
      "Forma de borrar la cuenta",
      "Desde la app y desde la web",
      false
     ],
     [
      "URL para borrar la cuenta",
      "https://tatamigo.vikingzone.app/borrar-cuenta.html"
     ],
     [
      "Datos que se recopilan (todos: Recopilados, NO compartidos, para Funcionalidad de la app y Administración de cuentas)",
      "Ubicación precisa (solo al escanear el QR, procesada al momento: marcar \"efímera\"); Nombre; Correo electrónico; Número de teléfono (WhatsApp, opcional); Otra información (fecha de nacimiento, cinturón); Fotos; Otros mensajes en la app (tablón); Historial de compras (registro de cuotas); IDs de dispositivo u otros (para notificaciones)",
      false
     ],
     [
      "¿Es obligatorio?",
      "Nombre, correo y fecha de nacimiento: obligatorios. Teléfono, fotos y ubicación: opcionales (el usuario elige)",
      false
     ]
    ],
    "nota": "Google pide marcar cada tipo y para qué se usa. Nada se comparte con terceros ni se usa para publicidad.",
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Configurar: apps gubernamentales",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Apps gubernamentales",
    "campos": [
     [
      "Respuesta",
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
      "Respuesta",
      "Mi app no ofrece ninguna función financiera (las cuotas solo se anotan; todavía no se cobra por la app)",
      false
     ]
    ],
    "nota": "Cuando sumemos Mercado Pago (parte 7) hay que volver a esta declaración."
   },
   {
    "titulo": "Configurar: salud",
    "bloque": "Panel → Configura la app (12 tareas)",
    "donde": "Panel → Salud",
    "campos": [
     [
      "Respuesta",
      "Mi app no tiene funciones de salud",
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
      "Qué es",
      "Una ley de la Unión Europea: si sos \"comerciante\" (ganás plata con la app), Google muestra tu nombre, dirección y teléfono a los usuarios de Europa.",
      false
     ],
     [
      "Sugerencia",
      "Usá la misma respuesta que en FilaKot y el Truco. Si no la recordás: hoy TatamiGo no cobra nada, así que \"No soy comerciante\" es válido; cuando cobre comisión, pasa a \"Soy comerciante\".",
      false
     ]
    ],
    "nota": "Lo decidís vos."
   },
   {
    "titulo": "Configurar: categoría y contacto",
    "donde": "Panel → Selecciona la categoría de app y proporcionar detalles de contacto",
    "campos": [
     [
      "Categoría",
      "Deportes (alternativa: Educación)",
      false
     ],
     [
      "Etiquetas",
      "Deportes, Fitness, Organizador",
      false
     ],
     [
      "Correo",
      "ebogni@gmail.com"
     ],
     [
      "Sitio web",
      "https://tatamigo.vikingzone.app"
     ]
    ],
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Configurar: ficha de Play Store",
    "donde": "Panel → Configura la ficha de Play Store",
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
     ]
    ],
    "nota": "Las traducciones (inglés y portugués) y sus capturas las carga Claude solo por GitHub cuando la ficha en español esté guardada.",
    "bloque": "Panel → Configura la app (12 tareas)"
   },
   {
    "titulo": "Prueba cerrada (14 días, 12 testers)",
    "donde": "Panel → \"Prueba la app con un grupo más grande de verificadores\" (se habilita cuando están las 12 tareas) → Ver tareas",
    "campos": [
     [
      "Testers",
      "Elegí tu lista fija de testers (la misma de las otras apps)",
      false
     ],
     [
      "Países",
      "Argentina (y los que quieras sumar)",
      false
     ]
    ],
    "nota": "Cuando esté creada, avisale a Claude: él sube la versión a la prueba cerrada y la manda a revisión. Desde que los testers la instalan corren los 14 días.",
    "bloque": "Panel → Lanza la app"
   }
  ]
 }
};
