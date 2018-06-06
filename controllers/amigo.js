const OneSignal = require('onesignal-node');

const Amigo       = require('../models').Amigo;
const Invitacion  = require('../models').Invitacion;
const Notificacion= require('../models').Notificacion;
const pushServer  = require('../socket').Servidor;


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

const enviarInvitacion = async function(emisor,receptorId,notificacion,invitacion){
  //enviar invitacion por push y por socket
  let receptor, enviado = false;
  pushServer
    .getCliente(receptorId)
    .then((receptor)=>{
      let data = {
          "tipo"        :"invitacion",
          "emisor"      :emisor.id,
          "notificacion":notificacion.toWeb(),
          "invitacion"  :invitacion.toWeb()
      };

      if(receptor.usuario.deviceId){
        let oneSignal = pushServer.oneSignal;
        console.log("receptor deviceId",receptor.deviceId);
        var notificacion = new OneSignal.Notification({
          "contents": {
              "en" : notificacion.contenido,
              "es" : notificacion.contenido
          },
          "headings":{
            "en" : notificacion.titulo,
            "es" : notificacion.titulo
          },
          "data": data,
          "large_icon": receptor.usuario.imagesrc,
          "android_group": oneSignal.groupKeys.INVITACION_AMIGO,
          "android_group_message": "Invitaciones de amistad"
        });
        notificacion.setTargetDevices([receptor.deviceId]);
        onesignal.cliente.sendNotification(notificacion)
          .then((response)=>{
            console.log(response.data, response.httpResponse.statusCode);
          })
          .catch((err)=>{console.log("error enviando push",err)});
      }else{
        console.log("no posee deviceId");
      }
    });
}
