const Lista          = require('../models').Lista;
const DetalleLista   = require('../models').DetalleLista;
const decorar       = require('../services/decorador');
const mtg           = require('mtgsdk');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, lista;
    let tipo = req.body.tipo;
    let usuario = req.user;

    mazoInfo.UsuarioId = usuario.id;

    [err, lista] = await to(Lista.create({tipo:tipo}));
    if(err) return ReE(res, {success:false, error:err}, 422);

    let listaJson = lista.toWeb();

    return ReS(res,{lista:listaJson}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, listas;
    let usuario = req.user;
    [err, listas] = await to(Lista.findAll({
      where:{"UsuarioId":usuario.id}
    }));
    let listasJson = await Promise.all(listas.map(async (lista) => {
      mazo = await decorar.lista(lista);
      return lista;
    }));
    return ReS(res, {listas:listasJson});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err,lista;
    const ListaId = req.params.idLista;
    [err, lista] = await to(Lista.findOne({
      where:{"id":ListaId}
    }));
    console.log(err);
    if(err) return ReE(res, "err encontrando lista");
    //busco el detalle del mazo
    lista = await decorar.lista(lista);
    return ReS(res, {"lista":lista});
}
module.exports.get = get;

const update = async function(req, res){
    let err, lista;

    [err, lista] = await to(Lista.findOne({where:{"id":req.params.idLista}}));
    if(err) return ReE(res, "err encontrando mazo");

    lista.set(req.body);

    [err, lista] = await to(lista.save());
    if(err)  return ReE(res, {success:false, error:err});

    return ReS(res, {"lista":lista.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let err, lista;

  [err, lista] = await to(Lista.findOne({where:{"id":req.params.idMazo}}));
  if(err) return ReE(res, "err encontrando mazo");

  [err, lista] = await to(lista.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el mazo');

  return ReS(res, {message:'Mazo eliminado'}, 200);
}
module.exports.remove = remove;
