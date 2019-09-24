const Invitacion  = require('../models').Invitacion;
const Notificacion= require('../models').Notificacion;

const get = async function(idInvitacion){
  let err,invitacion;
  return new Promise(async (resolve,reject)=>{
    [err, invitacion] = await to(Invitacion.findOne({
      include:[{model:Notificacion}],
      where:{id:idInvitacion}
    }))
    if(err) reject(err);
    resolve(invitacion);
  });
}

module.exports.get = get;

const create = async function(emisor,receptorId,vencimiento,tipo){
  let err, notificacion, invitacion;
  return new Promise(async (resolve,reject)=>{
    [err,notificacion] = await to(Notificacion.create({
      "titulo":"invitacion  a un duelo",
      "contenido":emisor.username+" te ha retado",
      "estado":"P",
      "UsuarioId": receptorId
    }));
    if(err) reject(err);
    [err, invitacion] = await to(Invitacion.create({
      "tipo"          : tipo,
      "idInvitado"    : emisor.id,
      "estado"        : "P", //pendiente
      "vencimiento"   : vencimiento,
      "NotificacionId": notificacion.id
    }));
    console.log("[Err]",err);
    if(err){
      reject(err);
    } else{      
      resolve(notificacion.toWeb(),invitacion.toWeb());
    }
  });  
}

module.exports.create = create;