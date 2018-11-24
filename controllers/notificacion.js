const Notificacion  = require('../models').Notificacion;
const Invitacion    = require('../models').Invitacion;
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



