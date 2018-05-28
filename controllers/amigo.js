const Amigo       = require('../models').Amigo;
const Invitacion  = require('../models').invitacion
const Notificacion= require('../models').Notificacion;
const io          = require('socket.io');

const getAll = async function(req, res){
  res.setHeader('Content-Type', 'application/json');
  let err, amigos, usuario = req.user;
  [err, amigos] = await to(usuario.getAmigos());
  if(err) ReE(res, err, 422);

  amigos = amigos.map(async (amigo)=>{
    return amigo.toWeb();
  })
  return ReS(res, {formatos:formatosJson});
}

module.exports.getAll = getAll;

const crearInvitacion = async function(req, res){
  let err, notificacion, invitacion
  emisor    = req.usuario,
  receptor  = req.body.invitado,
  now       = new Date();
  [err,notificacion] = await to(Notificacion.create({
    "titulo":"invitacion de amistad",
    "contenido":invitador.username+" quiere ser tu amigo",
    "estado":"P",
    "UsuarioId": receptor.id
  }));
  if(err) ReE(res, err, 422);
  [err, invitacion] = await to(Invitacion.create({
    "tipo"          : "A", //amistad
    "idInvitado"    : emisor.id,
    "estado"        : "P", //pendiente
    "vencimiento"   : now.setDate(now.getDate() + 30),
    "NotificacionId": notificacion.id
  }));
  if(err) ReE(res, err, 422);
  enviarInvitacion(emisor,receptor,notificacion,invitacion);
  ReS(res, {success:true,message:"invitacion enviada de forma exitosa"});
}

module.exports.crearInvitacion = crearInvitacion;

const enviarInvitacion = async function(emisor,receptor,notificacion,invitacion){
  //enviar envitacion  y por socket
  io.sockets.map((socket)=>{
    if(socket.usuario.id === receptor.id){
      console.log(socket.usuario);
      // TODO: falta agregar la invitacion a la bd y ademas falta agregar el push
      socket.emit("invitacion:amigo",{
        "emisor"      :emisor.id,
        "notificacion":notificacion.toWeb(),
        "invitacion"  :invitacion.toWeb()
      });
    }
  });
}
