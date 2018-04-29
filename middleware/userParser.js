const Usuario = require('./../models').Usuario;
const UsuarioController = require('../controllers/usuario');

let retador = async function (req, res, next) {
    let idRetador, err, retador;
    idRetador = req.body.idRetador;

    [err, retador] = await to(Usuario.findOne({where:{"id":idRetador}}));
    if(err) return ReE(res, "err encontrando retador");

    if(!retador) return ReE(res, "Retador no encontrando con id "+idUsuario);

    [err, retador] = await to(UsuarioController.decoradorUsuario(retador));
    if(err) next(err, false);
    req.retador = retador;
    next();
}
module.exports.retador = retador;
