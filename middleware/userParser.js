const Usuario = require('./../models').Usuario;

let usuario = async function (req, res, next) {
    let idUsuario, err, usuario;
    idUsuario = req.params.id;

    [err, usuario] = await to(Usuario.findOne({where:{"id":idUsuario}}));
    if(err) return ReE(res, "err encontrando usuario");

    if(!usuario) return ReE(res, "Usuario no encontrando con id "+idUsuario);

    req.usuario = usuario;
    next();
}
module.exports.usuario = usuario;

let retador = async function (req, res, next) {
    let idRetador, err, retador;
    idRetador = req.params.idRetador;

    [err, retador] = await to(Usuario.findOne({where:{"id":idRetador}}));
    if(err) return ReE(res, "err encontrando retador");

    if(!retador) return ReE(res, "Retador no encontrando con id "+idUsuario);

    req.usuario = retador;
    next();
}
module.exports.retador = retador;
