const OneSignal = require('onesignal-node');

const pushServer  = require('../socket').Servidor;

const Notificacion  = require('../models').Notificacion;
const Invitacion    = require('../models').Invitacion;
const Amigo         = require('../models').Amigo;
const decorar       = require('../services/decorador');

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, notificaciones,
    usuario = req.user;
    [err, notificaciones] = await to(Notificacion.findAll({
      include:[{model:Invitacion}],
      where:{UsuarioId:usuario.id}
    }));
    if(err) return ReE(res,{"success":false,"error":err});
    notificaciones = await Promise.all(notificaciones.map(async (notificacion)=>{
      let newNot;
      if(notificacion.Invitacions.length){
        newNot = await decorar.invitacion(notificacion);
      }else{
        newNot = notificacion.toWeb();
      }
      return newNot;
    }));
    return ReS(res, {"success":true,"notificaciones":notificaciones});
}
module.exports.getAll = getAll;

const aceptar = async function(req, res){
  let err, invitacion, usuario = req.user;
  [err, invitacion] = await to(Invitacion.findOne({
    include:[{model:Notificacion}],
    where:{id:req.params.id}
  }))
  if(err) return ReE(res, {success:false, error:err},422);

  let notificacion = invitacion.Notificacion,
  anfitrion = invitacion.idInvitado,
  invitado  = notificacion.UsuarioId;
  operaciones = await Promise.all([
    //creo amigo en la lista del invitado
    Amigo.create({
      idAmigo   : anfitrion,
      UsuarioId : invitado,
    }),
    //creo amigo en lista del anfitrion
    Amigo.create({
      idAmigo   : invitado,
      UsuarioId : anfitrion,
    }),
    //destruyo la invitacion
    invitacion.destroy(),
    //guardo los cambios en la notificacion
    notificacion.destroy(),
    //envio respuesta
    enviarRespuestaInvitacion(anfitrion,usuario)
  ]).catch((err)=>{
    console.log(err);
  });
  return ReS(res, {"success":true,"message":"amigo agregado"});
}
module.exports.aceptar = aceptar;

const rechazar = async function(req, res){
  let err, invitacion;
  [err, invitacion] = await to(Invitacion.findOne({
    include:[{model:Notificacion}],
    where:{id:req.params.id}
  }))
  if(err) return ReE(res, {success:false, error:err},422);

  let notificacion = invitacion.Notificacion;
  operaciones = await Promise.all([
    //destruyo la invitacion
    invitacion.destroy(),
    //guardo los cambios en la notificacion
    notificacion.destroy()]
  ).catch((err)=>{
    console.log(err);
  });
  return ReS(res, {"success":true,"message":"invitacion rechazada"})
}
module.exports.rechazar = rechazar;

const enviarRespuestaInvitacion = function(receptorId,emisor){
  return new Promise(async (resolve,reject)=>{
    pushServer
      .getUsuario(receptorId)
      .then((receptor)=>{
        if(receptor.deviceId){
          let oneSignal = pushServer.onesignal;
          let data = {
            "tipo"  : "amigo"
          }
          let push = new OneSignal.Notification({
            "contents": {
                "en" : emisor.username+' acepto tu invitacion de amistad',
                "es" : emisor.username+' acepto tu invitacion de amistad'
            }
          });
          push.setTargetDevices([receptor.deviceId]);
          push.setParameter("headings",{
            "en" : "Nuevo amigo",
            "es" : "Nuevo amigo"
          });
          push.setParameter("data", data);
          push.setParameter("large_icon",emisor.imagesrc);
          push.setParameter("android_group",oneSignal.groupKeys.INVITACION_AMIGO);
          push.setParameter("android_group_message", "Invitaciones de amistad");

          oneSignal.client.sendNotification(push)
            .then((response)=>{
              resolve();
              console.log("ONESIGNAL: notificacion enviada",response.data, response.httpResponse.statusCode)
            })
            .catch((err)=>{console.log("error enviando push",err)});
        }else{
          reject();
          console.log("no posee deviceId");
        }
      })
  });
}
