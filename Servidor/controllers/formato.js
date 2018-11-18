const Formato = require('../models').Formato;

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, formato;
    let formatoInfo = req.body;

    [err, formato] = await to(Formato.create(formatoInfo));
    if(err) return ReE(res, {success:false, error:err}, 422);

    let formatoJson = formato.toWeb();

    return ReS(res,{formato:formatoJson}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, formatos;

    [err, formatos] = await to(Formato.findAll());
    let formatosJson = formatos.map(formato => {
      return formato.toWeb();
    });
    return ReS(res, {formatos:formatosJson});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    [err, formato] = await to(Formato.findOne({where:{"id":req.body.idFormato}}));
    if(err) return ReE(res, "err encontrando formato");

    return ReS(res, {formato:formato.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, formato;

    [err, formato] = await to(Formato.findOne({where:{"id":req.params.id}}));
    if(err) return ReE(res, "err encontrando formato");

    formato.set(req.body);

    [err, formato] = await to(formato.save());
    if(err){
        return ReE(res, {success:false, error:err});
    }
    return ReS(res, {formato:formato.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let err, formato;

  [err, formato] = await to(Formato.findOne({where:{"id":req.params.id}}));
  if(err) return ReE(res, "err encontrando formato");

  [err, formato] = await to(formato.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el formato');

  return ReS(res, {message:'Formato eliminado'}, 200);
}
module.exports.remove = remove;
