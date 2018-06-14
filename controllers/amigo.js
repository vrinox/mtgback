const OneSignal = require('onesignal-node');

const Amigo       = require('../models').Amigo;
const Usuario     = require('../models').Usuario;
const Invitacion  = require('../models').Invitacion;
const Notificacion= require('../models').Notificacion;
const pushServer  = require('../socket').Servidor;


const getAll = async function(req, res){
  res.setHeader('Content-Type', 'application/json');
  let err, amigos, usuario = req.user;
  [err, amigos] = await to(Amigo.findAll({
    "include":[{"model":Usuario}],
    "where":{"UsuarioId":usuario.id}
  }));
  if(err) ReE(res, {success:false, error:err}, 422);
  amigos = await Promise.all(amigos.map(async (amigo)=>{
    return amigo.Usuario.toWeb();
  }));
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
  if(err){
    ReE(res, {success:false, error:err}, 422);
  } else{
    enviarInvitacion(emisor,receptorId,notificacion.toWeb(),invitacion.toWeb());
    ReS(res, {success:true,message:"invitacion enviada de forma exitosa"});
  }
}

module.exports.crearInvitacion = crearInvitacion;

const enviarInvitacion = async function(emisor,receptorId,notificacion,invitacion){
  //enviar invitacion por push y por socket
  let receptor, enviado = false;
  pushServer
    .getUsuario(receptorId)
    .then((receptor)=>{
      let data = {
          "tipo"        :"invitacion",
          "emisor"      :emisor.id,
          "notificacion":notificacion,
          "invitacion"  :invitacion
      };

      if(receptor.deviceId){
        let oneSignal = pushServer.onesignal;
        var push = new OneSignal.Notification({
          "contents": {
              "en" : notificacion.contenido,
              "es" : notificacion.contenido
          }
        });
        push.setTargetDevices([receptor.deviceId]);

        push.setParameter("headings",{
          "en" : notificacion.titulo,
          "es" : notificacion.titulo
        });
        push.setParameter("data", data);
        push.setParameter("large_icon",emisor.imagesrc);
        push.setParameter("android_group",oneSignal.groupKeys.INVITACION_AMIGO);
        push.setParameter("android_group_message", "Invitaciones de amistad");

        oneSignal.client.sendNotification(push)
          .then((response)=>{
            console.log("ONESIGNAL: notificacion enviada",response.data, response.httpResponse.statusCode)
          })
          .catch((err)=>{console.log("error enviando push",err)});
      }else{
        console.log("no posee deviceId");
      }
    });
}
