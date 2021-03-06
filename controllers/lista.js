const Lista          = require('../models').Lista;
const DetalleLista   = require('../models').DetalleLista;
const decorar       = require('../services/decorador');
const mtg           = require('mtgsdk');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, lista;
    let listaInfo = req.body;
    let usuario = req.user;

    listaInfo.UsuarioId = usuario.id;

    [err, lista] = await to(Lista.create(listaInfo));
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
      lista = await decorar.lista(lista);
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
    //busco el detalle del lista
    lista = await decorar.lista(lista);
    return ReS(res, {"lista":lista});
}
module.exports.get = get;

const update = async function(req, res){
    let err, lista;

    [err, lista] = await to(Lista.findOne({where:{"id":req.params.idLista}}));
    if(err) return ReE(res, "err encontrando Lista");

    lista.set(req.body);

    [err, lista] = await to(lista.save());
    if(err)  return ReE(res, {success:false, error:err});

    return ReS(res, {"lista":lista.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let err, lista;

  [err, lista] = await to(Lista.findOne({where:{"id":req.params.idLista}}));
  if(err) return ReE(res, "err encontrando Lista");

  [err, lista] = await to(lista.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el Lista');

  return ReS(res, {message:'Lista eliminado'}, 200);
}
module.exports.remove = remove;

const search = async function(req, res){
  res.setHeader('Content-Type', 'application/json');
  filtros = req.body.filtros,
  newFiltros = {
    $or:{}
  };
  Object.keys(filtros).forEach((each)=>{
    newFiltros.$or[each]={
      $like:'%'+filtros[each].toLowerCase()+'%'
    }
  });
  [err, listas] = await to(Lista.findAll({
    include:[{
      model:Usuario
    }],
    where:newFiltros
  }));
  if(err) ReE(res, {success:false, error:err}, 422);
  let listasJson = await Promise.all(listas.map(async (lista) => {
    lista = await decorar.lista(lista);
    return lista;
  }));
  return ReS(res, {listas:listasJson});
}
module.exports.search = search;
