const Duelo = require('../models').Duelo;

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, duelo, dueloInfo, usuario, retador;
    usuario = req.user;
    retador = req.retador;
    dueloInfo = req.body;

    [err, duelo] = await to(Duelo.create(dueloInfo));
    if(err) return ReE(res, {success:false, error:err}, 422);
    usuario.addDuelo(duelo, {through:"retado"});
    retador.addDuelo(duelo, {through:"retador"});
    let dueloJson = duelo.toWeb();

    return ReS(res,{duelo:dueloJson}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, duelos, usuario;
    usuario = req.user;

    [err, duelos] = await to(usuario.getDuelos());
    let duelosJson = duelos.map(duelo => {
      return duelo.toWeb();
    });
    console.log('duelos',duelos);
    return ReS(res, {duelos:duelosJson});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idDuelo, duelo;
    idDuelo = req.body.idDuelo;
    [err, duelo] = await to(Duelo.findOne({where:{id:idDuelo}}));
    if(err) return ReE(res, "err encontrando duelo");

    return ReS(res, {duelo:duelo.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, duelo;

    [err, duelo] = await to(Duelo.findOne({where:{"id":req.body.idDuelo}}));
    if(err) return ReE(res, "err encontrando duelo");

    duelo.set(req.body);

    [err, duelo] = await to(duelo.save());
    if(err){
        return ReE(res, {success:false, error:err});
    }
    return ReS(res, {duelo:duelo.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let err, duelo;

  [err, duelo] = await to(Duelo.findOne({where:{"id":req.body.idDuelo}}));
  if(err) return ReE(res, "err encontrando duelo");

  [err, duelo] = await to(duelo.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el duelo');

  return ReS(res, {message:'Duelo eliminado'}, 204);
}
module.exports.remove = remove;
