// Contenido de los 6 videos: S = temas
const S=[
{n:"1.1.1",t:"Conceptos básicos",o:"Distinguir seguridad de la información, informática, ciberseguridad y de software, y clasificar dato, activo, recurso, sistema, servicio, usuario, control e incidente.",
p:"Una universidad publica un sistema académico que funciona, pero al cambiar /estudiante/1001 por /estudiante/1002 se ven datos ajenos. Funcionalidad y seguridad no son equivalentes.",
f:["Usuario","Aplicación web","API","Base de datos"],
c:[["Seguridad de la información","Protege la información en cualquier medio: digital, impreso, verbal."],["Seguridad informática","Protege sistemas, hardware, software, redes y datos frente a accesos, daños o interrupciones."],["Ciberseguridad","Protege activos y servicios conectados al ciberespacio (p. ej. una API pública)."],["Seguridad de software","Diseñar, desarrollar, probar, desplegar y mantener aplicaciones que resistan abusos."],["Dato vs información","8.5 es un dato; «la nota final en Seguridad de Software es 8.5/10» es información."],["Activo","Lo que tiene valor y debe protegerse: código, credenciales, BD, reputación."],["Recurso","Elemento que permite operar un servicio: CPU, RAM, API, servidor, desarrollador."],["Sistema","Componentes organizados que interactúan para un objetivo."],["Servicio","Capacidad que un sistema ofrece: autenticación, consulta de notas, pagos."],["Usuario","Persona, sistema o proceso que interactúa con un recurso; cada uno con permisos distintos."],["Control","Medida técnica, administrativa o física que reduce probabilidad o impacto."],["Incidente","Evento que compromete o amenaza la seguridad: fuga, robo de cuenta, caída."]],
cb:`// Endpoint vulnerable (IDOR)
app.get('/api/notas/:id', (req,res)=>{
  const n = db.notas.find(req.params.id);
  res.json(n);            // no valida dueño
});`,ca:`app.get('/api/notas/:id', auth, (req,res)=>{
  const n = db.notas.find(req.params.id);
  if(!n || n.estudianteId !== req.user.id)
    return res.status(403).json({error:'Prohibido'});
  res.json(n);
});`,tb:"Con sesión del estudiante 1001, pedir /api/notas/1002 → devuelve datos ajenos (200).",ta:"Repetir la misma petición → 403. Pedir /api/notas/1001 → 200.",
q:[["ljaramillo@universidad.edu.ec","Dato (con contexto, información personal)."],["Base de datos de estudiantes","Activo."],["Autenticación multifactor","Control."],["API de notas","Servicio."],["Un estudiante descarga datos de otro","Incidente."],["Servidor de aplicaciones","Recurso."],["Administrador del sistema","Usuario."]]},
{n:"1.1.2",t:"Tríada CIA y Hexad de Parker",o:"Analizar un error de programación con CIA (confidencialidad, integridad, disponibilidad) y completar con posesión/control, autenticidad y utilidad.",
p:"Si una app protege la contraseña pero permite modificar notas o cae durante horas, ¿es segura? No: CIA se compromete en cualquiera de sus tres propiedades.",
f:["Confidencialidad","Integridad","Disponibilidad","Posesión/Control","Autenticidad","Utilidad"],
c:[["Confidencialidad","Solo personas o procesos autorizados acceden. Falla: usuario A lee datos de B. Control: autorización por recurso, cifrado."],["Integridad","Exactitud y ausencia de cambios no autorizados. Falla: cliente envía saldo=99999. Control: validación en servidor, transacciones."],["Disponibilidad","Acceso cuando se necesita. Falla: caída en matrícula, bucle que agota CPU. Control: límites, redundancia."],["Posesión / control","Quién controla físico o lógicamente el activo. Portátil cifrado robado: confidencialidad ok, control perdido."],["Autenticidad","La entidad, mensaje o archivo es quien dice ser. Un documento íntegro puede no tener emisor verificado."],["Utilidad","La información sirve para su propósito. Respaldo disponible pero que no se puede restaurar."]],
cb:`// Integridad rota: confía en el cliente
app.post('/pedido',(req,res)=>{
  db.guardar({item:req.body.item, total:req.body.total});
  res.send('ok');
});`,ca:`app.post('/pedido', auth, (req,res)=>{
  const precio = db.precioDe(req.body.item); // servidor decide
  const total = precio * Number(req.body.cant);
  db.guardar({item:req.body.item, total, user:req.user.id});
  res.send('ok');
});`,tb:"Enviar total=1 por Postman y comprobar que el pedido se guarda con ese valor.",ta:"Reenviar total=1 → se ignora y se guarda el precio real calculado.",
q:[["Usuario consulta datos de otro","Confidencialidad."],["Pedido cambia de USD 50 a 500","Integridad."],["Servicio caído en la matrícula","Disponibilidad."],["Dispositivo cifrado robado","Posesión/Control."],["Respaldo que no se puede restaurar","Utilidad."]]},
{n:"1.1.3",t:"Autenticidad, trazabilidad, responsabilidad y no repudio",o:"Relacionar los cuatro principios y justificar qué debe registrar un log para atribuir una acción y aportar evidencia.",
p:"Si una acción aparece en el sistema, ¿podemos demostrar quién la hizo, cuándo, y evitar que la niegue después?",
f:["Autenticidad: ¿quién es?","Trazabilidad: ¿qué, cuándo, desde dónde?","Responsabilidad: ¿a quién se atribuye?","No repudio: ¿puede negarlo?"],
c:[["Autenticidad","Comprobar que una identidad, mensaje o transacción es genuina (login con segundo factor)."],["Trazabilidad","Registrar y reconstruir acciones: fecha, usuario, IP, operación, recurso, resultado, correlación."],["Responsabilidad","Atribuir acciones a una entidad individual identificable; evitar cuentas compartidas como «admin»."],["No repudio","Evidencia verificable (firma digital, aprobación registrada) que impide negar la acción."]],
cb:`console.log('ERROR LOGIN');`,ca:`log.info({ts:new Date().toISOString(), user:u,
  ip:req.ip, action:'LOGIN', result:'FAILED',
  reason:'INVALID_CREDENTIALS', reqId:req.id});
// 2026-09-30T11:20:45 user=estudiante17 ip=192.168.10.25 action=LOGIN result=FAILED`,tb:"Fallar un login y revisar el log: no dice quién, desde dónde ni por qué.",ta:"Repetir → el log permite reconstruir usuario, IP, hora y motivo.",
q:[["Certificado pertenece al servidor esperado","Autenticidad."],["Log que reconstruye quién cambió una nota","Trazabilidad."],["Acción atribuida a una cuenta individual","Responsabilidad."],["Evidencia verificable de aprobación","No repudio."]]},
{n:"1.1.4",t:"Amenaza, vulnerabilidad, riesgo y ataque",o:"Aplicar el modelo Activo → Amenaza → Vulnerabilidad → Ataque → Impacto → Riesgo → Control → Verificación a casos de software.",
p:"password = \"admin123\" ¿es amenaza, vulnerabilidad, ataque o incidente? Es una vulnerabilidad (secreto débil y hardcodeado); el ataque sería usarla.",
f:["Activo","Amenaza","Vulnerabilidad","Ataque","Impacto","Riesgo","Control","Verificación"],
c:[["Activo","Lo valioso: credenciales, datos, disponibilidad."],["Amenaza","Actor o evento capaz de dañar; existe aunque no haya ataque."],["Vulnerabilidad","Debilidad aprovechable: API sin autorización, contraseña débil."],["Ataque","Acción concreta que explota la vulnerabilidad: fuerza bruta."],["Impacto","Consecuencia: fuga, pérdida económica, caída."],["Riesgo","Posibilidad de daño ≈ probabilidad × impacto."],["Control","Reduce probabilidad, impacto o ambos: MFA, límites, revisión de código."],["Verificación","Comprobar que el control funciona: reintentar el ataque y ver que se bloquea."]],
cb:`const DB_PASS = "admin123";   // vulnerabilidad
conectar({user:'admin', pass:DB_PASS});`,ca:`const DB_PASS = process.env.DB_PASS; // secreto fuera del código
if(!DB_PASS) throw new Error('Falta DB_PASS');
conectar({user:process.env.DB_USER, pass:DB_PASS});`,tb:"Buscar el secreto en el repositorio (grep admin123) → aparece en el código.",ta:"Repetir grep → no aparece; la app falla con mensaje claro si falta la variable.",
q:[["Clave API embebida en código","Vulnerabilidad."],["Robo de credenciales","Ataque."],["Datos de clientes","Activo."],["Usuario interno malintencionado","Amenaza."],["MFA","Control."],["Alteración de registros","Impacto."],["Riesgo de acceso no autorizado","Riesgo."],["Intentos automatizados de contraseña","Ataque."],["Base de datos pública","Vulnerabilidad."],["Revisión de permisos","Control."]]},
{n:"1.2.1 · 1.2.2 · 1.2.3",t:"Amenazas, atacantes y ataques comunes",o:"Clasificar amenazas por origen, atacantes por motivación y capacidad, y ataques comunes con su propiedad CIA afectada y prevención desde el desarrollo.",
p:"No todos los ataques buscan destruir: algunos observan, suplantan, reutilizan información o interrumpen servicios. Y no todas las amenazas son atacantes.",
f:["Tipo de amenaza","Actor","Ataque","Propiedad CIA","Control"],
c:[["Natural","Terremoto, inundación → continuidad, backups.","Amenaza"],["Ambiental","Fallo eléctrico o de almacenamiento → disponibilidad.","Amenaza"],["Humana accidental","Borrar tabla, publicar clave, mal permiso.","Amenaza"],["Humana intencional","Fraude, sabotaje, robo, espionaje.","Amenaza"],["Atacante externo / insider","Sin acceso previo vs acceso legítimo abusado.","Atacante"],["Ciberdelincuente / grupos","Motivación económica, campañas sostenidas.","Atacante"],["Script kiddie / hacktivista","Poca técnica con exploits ajenos / motivación ideológica.","Atacante"],["Actor estatal","Recursos altos, espionaje e inteligencia.","Atacante"],["Malware","Virus (necesita host), gusano (se propaga), troyano, ransomware, spyware. Prevención: validar archivos, firmar, mínimo privilegio.","Ataque"],["Snooping / Sniffing","Observación pasiva amplia vs captura de tráfico. Prevención: HTTPS/TLS. Afecta confidencialidad.","Ataque"],["Spoofing / Masquerading","Falsificar origen vs actuar como entidad legítima con sesión robada.","Ataque"],["Replay","Reenvío de solicitud válida. Control: nonce, timestamp, expiración, token de un uso.","Ataque"],["DoS","Saturar o agotar recursos. Control: rate limiting, timeouts, paginación. Afecta disponibilidad.","Ataque"],["Contraseñas","Diccionario, fuerza bruta, credential stuffing. Control: MFA, límite de intentos, hash seguro.","Ataque"],["Ingeniería social","Phishing, smishing, vishing, pretexting, baiting. Control: MFA, alertas, confirmaciones.","Ataque"]],
cb:`// Replay: el token se puede reutilizar
app.post('/aprobar',(req,res)=>{
  if(tokens.has(req.body.token)) aprobar(req.body.id);
  res.send('ok');
});`,ca:`app.post('/aprobar',(req,res)=>{
  const t = tokens.get(req.body.token);
  if(!t || t.usado || t.exp < Date.now()) return res.sendStatus(401);
  t.usado = true;                  // un solo uso + expiración
  aprobar(req.body.id); res.send('ok');
});`,tb:"Enviar dos veces la misma solicitud → ambas se aceptan.",ta:"Segunda vez → 401 (token usado o expirado).",
q:[["Captura de tráfico HTTP","Sniffing · Confidencialidad · HTTPS/TLS."],["Reutilización de solicitud válida","Replay · Integridad · tokens de un uso."],["Saturación de una API","DoS · Disponibilidad · rate limiting."],["Uso de contraseña filtrada","Credential stuffing · Confidencialidad · MFA."],["Falso técnico pide código MFA","Pretexting/vishing · Confidencialidad · educación y MFA resistente."]]},
{n:"1.3.1",t:"Tipos de controles",o:"Proponer controles preventivos, detectivos y correctivos (técnicos, administrativos y físicos) bajo defensa en profundidad.",
p:"Un mismo riesgo necesita varios controles; un log detecta pero no previene. Ningún control debe ser el único.",
f:["MFA","Autorización","Validación","Logs y alertas","Backup / recuperación"],
c:[["Preventivo","Impide que ocurra: MFA, autorización, validación, permisos mínimos, cifrado."],["Detectivo","Identifica cuando ocurre: logs, alertas, monitoreo, auditoría (50 intentos fallidos → alerta)."],["Correctivo","Reduce consecuencias y recupera: restaurar backup, cambiar credenciales, parchear."],["Técnico","Software o mecanismo: MFA, WAF, cifrado."],["Administrativo","Políticas, capacitación, segregación de funciones."],["Físico","Cerraduras, CCTV, acceso a instalaciones."],["Defensa en profundidad","Varias capas: si una falla, otra contiene el daño."]],
cb:`app.post('/login',(req,res)=>{
  if(ok(req.body)) return res.send('ok');
  res.status(401).send('Error');   // intentos ilimitados
});`,ca:`const intentos = new Map();
app.post('/login',(req,res)=>{
  const n = intentos.get(req.ip)||0;
  if(n>=5){ log.warn({ip:req.ip,action:'LOCKOUT'}); return res.sendStatus(429); }
  if(ok(req.body)){ intentos.delete(req.ip); return res.send('ok'); }
  intentos.set(req.ip,n+1); res.status(401).send('Credenciales inválidas');
});`,tb:"Script de 20 intentos seguidos → todos se procesan sin bloqueo.",ta:"Repetir → desde el 6.º intento responde 429 y queda un log de bloqueo.",
q:[["Robo de cuenta","Prev: MFA + límite · Det: alerta de login anómalo · Corr: revocar sesiones y cambiar clave."],["Modificación de notas","Prev: autorización · Det: log de cambios · Corr: restaurar versión."],["Eliminación accidental","Prev: permisos mínimos, separar entornos · Det: auditoría · Corr: backup."],["API saturada","Prev: rate limit · Det: monitoreo · Corr: failover."],["Secreto en repositorio","Prev: gestor de secretos, pre-commit scan · Det: escaneo de repos · Corr: rotar la clave."]]}
];
