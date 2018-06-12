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
      console.log(notificacion);
      let afitrion = notificacion.Invitacions[0].getUsuario();
      console.log(anfitrion);
      let newNot = notificacion.toWeb();
      newNot.anfitrion = anfitrion.toWeb();
      return newNot;
    });
    return ReS(res, {"success":true,"notificaciones":notificaciones});
}
module.exports.getAll = getAll;
