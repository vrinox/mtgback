const Amigo       = require('../models').Amigo;
const Invitacion  = require('../models').Invitacion;
const Notificacion= require('../models').Notificacion;
const io          = require('socket.io');

const getAll = async function(req, res){
  res.setHeader('Content-Type', 'application/json');
  let err, amigos, usuario = req.user;
  [err, amigos] = await to(usuario.getAmigos());
  if(err) ReE(res, {success:false, error:err}, 422);

  amigos = amigos.map(async (amigo)=>{
    return amigo.toWeb();
  })
  return ReS(res, {"success":true,"amigos":amigos});
}

module.exports.getAll = getAll;

const crearInvitacion = async function(req, res){
  let err, notificacion, invitacion
  emisor    = req.user,
  receptorId= req.body.invitado,
  now       = new Date();
  [err,notificacion] = await to(Notificacion.create({
    "titulo":"invitacion de amistad",
    "contenido":emisor.username+" quiere ser tu amigo",
    "estado":"P",
    "UsuarioId": receptorId
  }));
  if(err) ReE(res, {success:false, error:err}, 422);
  [err, invitacion] = await to(Invitacion.create({
    "tipo"          : "A", //amistad
    "idInvitado"    : emisor.id,
    "estado"        : "P", //pendiente
    "vencimiento"   : now.setDate(now.getDate() + 30),
    "NotificacionId": notificacion.id
  }));
  if(err) ReE(res, {success:false, error:err}, 422);
  enviarInvitacion(emisor,receptorId,notificacion,invitacion);
  ReS(res, {success:true,message:"invitacion enviada de forma exitosa"});
}

module.exports.crearInvitacion = crearInvitacion;

const enviarInvitacion = function(emisor,receptorId,notificacion,invitacion){
  //enviar invitacion por push y por socket
  let receptor, enviado = false;
  io.sockets.forEach( async (socket)=>{
    if(socket.usuario.id === receptorId){
      console.log("SOCKET: usuario "+socket.usuario.username+" encontrado");
      socket.emit("notificacion",{
        success: true,
        data:{
            "tipo"        :"invitacion",
            "emisor"      :emisor.id,
            "notificacion":notificacion.toWeb(),
            "invitacion"  :invitacion.toWeb()
        }
      });
      enviado = true;
    }
    if(!enviado){
      [err, receptor] = await to(Usuario.findOne({"where":{"id":receptorId}}));
      if(err) console.log("Error:",err);
      if(receptor.deviceId){
        console.log("receptor deviceId",receptor.deviceId);
        // TODO:agregar el push
      }else{
        console.log("no posee deviceId");
      }
    }
  });
}
