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
  let err, invitacion;
  [err, invitacion] = await to(Invitacion.findOne({
    include:[{model:Notificacion}],
    where:{id:req.params.id}
  }))
  if(err) return ReE(res, {success:false, error:err},422);

  let notificacion = invitacion.Notificacion;
  notificacion.estado = 'L';
  anfitrion : invitacion.idInvitado;
  invitado  : notificacion.UsuarioId;
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
    notificacion.save()
  ]).catch((err)=>{
    console.log(err);
  });
  return Res(res, {"success":true,"message":"amigo agregado"});
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
  notificacion.estado = 'L';
  operaciones = await Promise.all([
    //destruyo la invitacion
    invitacion.destroy(),
    //guardo los cambios en la notificacion
    notificacion.save()]
  ).catch((err)=>{
    console.log(err);
  });
  console.log(operaciones);
  return Res(res, {"success":true,"message":"invitacion rechazada"})
}
module.exports.rechazar = rechazar;
