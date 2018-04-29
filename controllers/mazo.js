const Mazo = require('../models').Mazo;
const Formato = require('../models').Formato;

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, mazo;
    let mazoInfo = req.body;
    let usuario = req.usuario;

    mazoInfo.UsuarioId = usuario.dataValues.id;
    console.log(mazoInfo);
    [err, mazo] = await to(Mazo.create(mazoInfo));
    if(err) return ReE(res, err, 422);

    [err, mazo] = await to(Mazo.findOne({
      include:[{
        model:Formato,
        as:"formato"
      }],
      where:{"id":mazo.dataValues.id}
    }));
    let mazoJson = mazo.toWeb();

    return ReS(res,{mazo:mazoJson}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, mazos;

    [err, mazos] = await to(Mazo.findAll());
    let mazosJson = mazos.map(mazo => {
      return mazo.toWeb();
    });
    console.log('mazos',mazos);
    return ReS(res, {mazos:mazosJson});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    [err, mazo] = await to(Mazo.findOne({where:{"id":req.body.idMazo}}));
    if(err) return ReE(res, "err encontrando mazo");

    return ReS(res, {mazo:mazo.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, mazo;

    [err, mazo] = await to(Mazo.findOne({where:{"id":req.params.id}}));
    if(err) return ReE(res, "err encontrando mazo");

    mazo.set(req.body);

    [err, mazo] = await to(mazo.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {mazo:mazo.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let err, mazo;

  [err, mazo] = await to(Mazo.findOne({where:{"id":req.params.id}}));
  if(err) return ReE(res, "err encontrando mazo");

  [err, mazo] = await to(mazo.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el mazo');

  return ReS(res, {message:'Mazo eliminado'}, 200);
}
module.exports.remove = remove;
