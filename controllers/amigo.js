const Invitacion  = require('./invitacion');
const Amigo       = require('../models').Amigo;
const Usuario     = require('../models').Usuario;
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

const crearInvitacion = async function(req,res){
  emisor      = req.user,
  receptorId  = req.body.invitado,
  vencimiento = new Date().setDate(new Date().getDate() + 30),
  tipo        = 'A';

  Invitacion.create(emisor,receptorId,vencimiento,tipo)
  .then((notificacion,invitacion)=>{
    let mensaje = {
      titulo        : notificacion.titulo,
      contenido     : notificacion.contenido,
      group_messaje : invitacion.titulo
    }
    let data = {
      "tipo"        :"invitacion",
      "emisor"      :emisor.id,
      "notificacion":notificacion,
      "invitacion"  :invitacion
    };
    return pushServer.enviarNotificacion(emisor,receptorId,"INVITACION_AMIGO",data,mensaje)
  })
  .then((response)=>{
    return ReS(res,{"success":true,"message":response},200);
  })
  .catch((error)=>{
    return ReE(res,{"success":false,"error":error},422);
  });
}

module.exports.crearInvitacion = crearInvitacion;

const aceptar = async function(req, res){
  let usuario = req.user;
  Invitacion
  .get(req.params.id)
  .then(async (invitacion)=>{
    let notificacion = invitacion.Notificacion,
    anfitrion = invitacion.idInvitado,
    invitado  = notificacion.UsuarioId;
    let mensaje = {
      titulo        : "Nuevo Amigo",
      contenido     : usuario.username+' acepto tu invitacion de amistad',
      group_messaje : "invitaciones de Amistad"
    };
    let data = {
      "tipo"  : "amigo"
    }
    return Promise.all([
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
      pushServer.enviarNotificacion(usuario,anfitrion,"INVITACION_AMIGO",data,mensaje)
    ]);
  })
  .then(()=>{
    return ReS(res, {"success":true,"message":"amigo agregado"});
  })
  .catch((err)=>{
    return ReE(res,{"success":false,"error":err},422);
  });
}
module.exports.aceptar = aceptar;

const rechazar = async function(req, res){
  Invitacion
  .get(req.params.id)
  .then((invitacion)=>{ 
    let notificacion = invitacion.Notificacion;
    return Promise.all([
      //destruyo la invitacion
      invitacion.destroy(),
      //guardo los cambios en la notificacion
      notificacion.destroy()]
    )
  })
  .then(()=>{
    return ReS(res, {"success":true,"message":"invitacion rechazada"})
  })
  .catch((err)=>{
    return ReE(res,{"success":false,"error":err},422);
  });
}
module.exports.rechazar = rechazar;