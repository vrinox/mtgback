const Notificacion  = require('../models').Notificacion;
const Invitacion    = require('../models').Invitacion;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, notificaciones,
    usuario = req.user;
    [err, notificaciones] = await to(Notificacion.findAll({
      include:[{model:Invitacion}],
      where:{UsuarioId:usuario.id}
    }));
    if(err) ReE(res,{"success":false,"error":err});
    notificaciones = notificaciones.map(notificacion => {
      let newNot = notificacion.toWeb();
      if(notificacion.Invitacions.length){
        console.log(notificacion.Invitacion);
        let anfitrion = notificacion.Invitacions[0].getUsuario();
        console.log(anfitrion);
        newNot.anfitrion = anfitrion.toWeb();
      }
      return newNot;
    });
    return ReS(res, {"success":true,"notificaciones":notificaciones});
}
module.exports.getAll = getAll;
