const Notificacion  = require('../models').Notificacion;
const Invitacion    = require('../models').Invitacion;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, notificaciones,invitaciones
    usuario = req.user;

    [err, invitaciones] = await to(Invitacion.findAll({
      include:[{
        model:Notificacion
      }],
      where:{
        UsuarioId:usuario.id
      }
    }));
    if(err) ReE(res,{"success":false,"error":err});
    invitaciones = invitaciones.map((invitacion)=>{
      return invitacion.toWeb();
    });
    // [err, notificaciones] = await to(Notificacion.findAll({
    //   where:{
    //     UsuarioId:usuario.id
    //   }
    // }));
    // notificaciones = notificaciones.map(notificacion => {
    //   let newNot = notificacion.toWeb();
    //   newNot.invitacion = notificacion.getInvitacions();
    //   return newNot;
    // });
    return ReS(res, {"success":true,"notificaciones":notificaciones});
}
module.exports.getAll = getAll;
