// Datos de cada app para el asistente de Play Console. Lo arma Claude; una entrada por app.
window.APPS = {
 "tatamigo": {
  "nombre": "TatamiGo",
  "paquete": "com.ebogni.tatamigo",
  "carpetaPC": "F:\\Progamacion\\Android\\01 - Apps\\DOJO",
  "pasos": [
   {
    "titulo": "Crear la app",
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
    "titulo": "Subir la primera versión (prueba interna)",
    "donde": "Prueba y lanzamiento → Pruebas → Prueba interna → Crear versión nueva",
    "campos": [
     [
      "Archivo para subir",
      "F:\\Progamacion\\Android\\01 - Apps\\DOJO\\Compilados\\TatamiGo-v1.aab"
     ],
     [
      "Nombre de la versión",
      "1"
     ],
     [
      "Notas de la versión",
      "<es-419>\nPrimera versión: asistencia con QR, cuotas, tablón, avisos de clases suspendidas, biblioteca, torneos y medallas.\n</es-419>"
     ]
    ],
    "nota": "Si pregunta por la firma de apps, elegí \"Usar la clave generada por Google\". Guardá; no hace falta publicar todavía. Las versiones siguientes las sube Claude solo."
   },
   {
    "titulo": "Huella de la firma de Google (para Claude)",
    "donde": "Prueba y lanzamiento → Configuración → Integridad de la app → Firma de apps",
    "campos": [],
    "nota": "Copiá el \"Certificado SHA-256\" de la clave de firma de apps y pegáselo a Claude en el chat. Sin eso, la app de Play muestra la barra de dirección arriba."
   },
   {
    "titulo": "Política de privacidad",
    "donde": "Panel → Configurar la app → Política de privacidad (o Contenido de la app)",
    "campos": [
     [
      "URL",
      "https://tatamigo.vikingzone.app/privacidad.html"
     ]
    ]
   },
   {
    "titulo": "Acceso a la app",
    "donde": "Contenido de la app → Acceso a la app",
    "campos": [
     [
      "Opción",
      "Todas o algunas funciones están restringidas",
      false
     ],
     [
      "Nombre de las instrucciones",
      "Entrar con Google"
     ],
     [
      "Instrucciones",
      "La app se usa entrando con cualquier cuenta de Google (no hay usuario ni contraseña propios). Para probar todo: 1) Tocá \"Continuar con Google\" con cualquier cuenta. 2) Elegí \"Soy profe\" y creá una academia de prueba. 3) Para ver la vista de alumno, entrá con otra cuenta de Google, elegí \"Soy alumno\" y escribí el código de la academia que aparece en el inicio del profe."
     ]
    ],
    "nota": "No hace falta cargar usuario y contraseña: el ingreso es con Google."
   },
   {
    "titulo": "Anuncios",
    "donde": "Contenido de la app → Anuncios",
    "campos": [
     [
      "¿Tiene anuncios?",
      "No, mi app no contiene anuncios",
      false
     ]
    ]
   },
   {
    "titulo": "Clasificación del contenido",
    "donde": "Contenido de la app → Clasificación del contenido → Iniciar cuestionario",
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
    "nota": "Terminá y tocá Guardar → Enviar."
   },
   {
    "titulo": "Público objetivo",
    "donde": "Contenido de la app → Público objetivo y contenido",
    "campos": [
     [
      "Grupos de edad",
      "18 años o más",
      false
     ],
     [
      "¿Atrae a niños?",
      "No",
      false
     ]
    ],
    "nota": "Los menores entran con permiso de su adulto, pero la app está pensada para profes y adultos. Si marcás menores de 13, entra en las reglas de Familias (mucho más estrictas)."
   },
   {
    "titulo": "Noticias, apps gubernamentales, funciones financieras y salud",
    "donde": "Contenido de la app (cada una)",
    "campos": [
     [
      "¿Es app de noticias?",
      "No",
      false
     ],
     [
      "¿App gubernamental?",
      "No",
      false
     ],
     [
      "Funciones financieras",
      "Mi app no ofrece ninguna función financiera (las cuotas se registran, no se cobran por la app todavía)",
      false
     ],
     [
      "Salud",
      "Mi app no tiene funciones de salud",
      false
     ]
    ]
   },
   {
    "titulo": "Seguridad de los datos",
    "donde": "Contenido de la app → Seguridad de los datos",
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
    "nota": "Google pide marcar cada tipo y para qué se usa. Nada se comparte con terceros ni se usa para publicidad."
   },
   {
    "titulo": "Ficha de Play Store (español)",
    "donde": "Crecer → Presencia en Play Store → Ficha principal",
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
    "nota": "Las traducciones (inglés y portugués) y sus capturas las carga Claude solo por GitHub cuando la ficha en español esté guardada."
   },
   {
    "titulo": "Categoría y datos de contacto",
    "donde": "Crecer → Presencia en Play Store → Configuración de la tienda",
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
    ]
   },
   {
    "titulo": "Prueba cerrada (14 días, 12 testers)",
    "donde": "Prueba y lanzamiento → Pruebas → Prueba cerrada → Crear pista / Alpha",
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
    "nota": "Cuando esté creada, avisale a Claude: él sube la versión a la prueba cerrada y la manda a revisión. Desde que los testers la instalan corren los 14 días."
   }
  ]
 }
};
