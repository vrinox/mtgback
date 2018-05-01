const Mazo = require('../models').Mazo;
const Formato = require('../models').Formato;
const DetalleMazo = require('../models').DetalleMazo;
const mtg = require('mtgsdk');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, mazo;
    let mazoInfo = req.body;
    let usuario = req.user;

    mazoInfo.UsuarioId = usuario.id;

    [err, mazo] = await to(Mazo.create(mazoInfo));
    if(err) return ReE(res, err, 422);
    [err, mazo] = await to(Mazo.findOne({
      include:[{
        model:Formato
      }],
      where:{"id":mazo.id}
    }));
    let mazoJson = mazo.toWeb();

    return ReS(res,{mazo:mazoJson}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, mazos;
    let usuario = req.user;
    [err, mazos] = await to(Mazo.findAll({
      include:[{
        model:Formato
      }],
      where:{"UsuarioId":usuario.id}
    }));
    let mazosJson = mazos.map(mazo => {
      return mazo.toWeb();
    });
    return ReS(res, {mazos:mazosJson});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    [err, mazo] = await to(Mazo.findOne({
      include:[{
        model:Formato
      }],
      where:{"id":req.params.idMazo}
    }));
    console.log(err);
    if(err) return ReE(res, "err encontrando mazo");
    //busco el detalle del mazo
    [err, cartas] = await to(mazo.getDetalleMazos());
    if(err) ReE(res, err);
    //busco todas las cartas con la api de mtg
    const pArray = cartas.map(async carta =>{
      const mtgCarta = await mtg.card.find(carta.idCarta);
      mtgCarta.card.userMetadata = {
        cantidad: carta.cantidad,
        id      : carta.id,
        tipo    : carta.tipo,
        idCarta : carta.idCarta,
      }
      return mtgCarta.card;
    });
    //activo la busqueda en paralelo
    const mtgCartas = await Promise.all(pArray);
    //inicializo los valores del main y side
    mazo.dataValues.main = [];
    mazo.dataValues.side = [];
    //organizo cada carta en su espacio
    mtgCartas.forEach(carta => {
      if(carta.userMetadata.tipo == "main"){
        mazo.dataValues.main.push(carta);
      }else{
        mazo.dataValues.side.push(carta);
      }
    })
    console.log(mazo.dataValues);
    return ReS(res, {mazo:mazo.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, mazo;

    [err, mazo] = await to(Mazo.findOne({where:{"id":req.params.idMazo}}));
    if(err) return ReE(res, "err encontrando mazo");

    mazo.set(req.body);

    [err, mazo] = await to(mazo.save());
    if(err)  return ReE(res, err);

    return ReS(res, {mazo:mazo.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let err, mazo;

  [err, mazo] = await to(Mazo.findOne({where:{"id":req.params.idMazo}}));
  if(err) return ReE(res, "err encontrando mazo");

  [err, mazo] = await to(mazo.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el mazo');

  return ReS(res, {message:'Mazo eliminado'}, 200);
}
module.exports.remove = remove;

/////////////Manejo de detalle//////////////////////////////////////////////////////////////////

const agregarCarta = async function(req, res){
  let err, carta, userMetadata,MazoId;
  /*
    userMetadata
    {
      id      : id de la bd
      cantidad: cantidad de esta carta en el mazo
      tipo    : main o side
      idCarta : id de la api
    }
  */
  userMetadata = req.body.userMetadata;
  userMetadata.MazoId = req.params.idMazo;
  [err, userMetadata] = await to(DetalleMazo.create(userMetadata));
  if(err) ReE(res, err);
  carta = req.body;
  carta.userMetadata = userMetadata.toWeb();

  return ReS(res, {"carta":carta});
}

module.exports.agregarCarta = agregarCarta;

const actualizarCarta = async function(req, res){
  let err, oldCarta, newCarta,fullCarta, userMetadata;
  /*
    userMetadata
    {
      id      : id de la bd
      cantidad: cantidad de esta carta en el mazo
      tipo    : main o side
      idCarta : id de la api
    }
  */
  userMetadata = req.body.userMetadata;
  userMetadata.MazoId = req.params.idMazo;
  [err, oldCarta] = await to(DetalleMazo.findOne({where:{"id":userMetadata.id}}));
  if(err) ReE(res, err);

  oldCarta.set(userMetadata);

  [err, newCarta] = await to(oldCarta.save());
  if(err)  return ReE(res, err);

  fullCarta = req.body;
  fullCarta.userMetadata = newCarta.toWeb();

  return ReS(res, {"carta":fullCarta});
}

module.exports.actualizarCarta = actualizarCarta;

const remove = async function(req, res){
  let err, idCarta, carta;
  idCarta = req.body.userMetadata
  [err, carta] = await to(DetalleMazo.findOne({where:{"id":idCarta}}));
  if(err) return ReE(res, "err encontrando mazo");

  [err, carta] = await to(car.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el mazo');

  return ReS(res, {message:'Mazo eliminado'}, 200);
}
module.exports.remove = remove;
