const Notificacion  = require('../models').Notificacion;
const Invitacion    = require('../models').Invitacion;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, notificaciones,
    usuario = req.user;

    [err, notificaciones] = await to(Notificacion.findAll({
      where:{
        UsuarioId:usuario.id
      }
    }));
    if(err) ReE(res,{"success":false,"error":err});
    notificaciones = formatos.map(notificacion => {
      let newNot = notificacion.toWeb();
      newNot.invitacion = notificacion.getInvitacions();
      return newNot;
    });
    return ReS(res, {"success":true,"notificaciones":notificaciones});
}
module.exports.getAll = getAll;
