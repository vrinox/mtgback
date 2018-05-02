const Mazo = require('../models').Mazo;
const DetalleMazo = require('../models').DetalleMazo;
const decorarCarta = require('./DetalleMazo').decorarCarta;
const Carta = require('../models').Carta;
const Formato = require('../models').Formato;
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

const duplicar = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, newMazo, oldMazo, cartas, mazoInfo;
    let idMazo = req.params.idMazo;
    let usuario = req.user;

    [err, cartas] = await to(DetalleMazo.findAll({where:{'MazoId':idMazo}}));
    if(err) ReE(res, err);

    mazoInfo = req.body

    [err, newMazo] = await to(Mazo.create(mazoInfo));
    if(err) return ReE(res, err, 422);

    cartas = cartas.map(carta=>{
      let userMetadata = carta.userMetadata;
      userMetadata.MazoId = newMazo.id;
      userMetadata.id = undefined;
      return userMetadata;
    });
    cartas = await Promise.all(cartas.map(carta=>{ return DetalleMazo.create(carta)}))

    return ReS(res,{mazo:newMazo.toWeb()}, 201);
}
module.exports.duplicar = duplicar;

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
    const MazoId = req.params.idMazo;
    [err, mazo] = await to(Mazo.findOne({
      include:[{
        model:Formato
      }],
      where:{"id":MazoId}
    }));
    console.log(err);
    if(err) return ReE(res, "err encontrando mazo");
    //busco el detalle del mazo
    [err, cartas] = await to(DetalleMazo.findAll({
      "include":[{
        "model":Carta,
      }],
      "where":{"MazoId":MazoId}
    }));
    if(err) ReE(res, err);
    const mtgCartas = cartas.map(oldCarta =>{
      newCarta = oldCarta.Carta;
      newCarta.userMetadata = {
        cantidad: oldCarta.cantidad,
        id      : oldCarta.id,
        tipo    : oldCarta.tipo,
        idCarta : oldCarta.idCarta,
      }
      return newCarta;
    });
    //inicializo los valores del main y side
    mazo.dataValues.main = [];
    mazo.dataValues.side = [];
    //acumulo los colores
    let seen = {};
    let colores = [];
    //organizo cada carta en su espacio
    mtgCartas.forEach(carta => {
      carta = decorarCarta(carta);
      if(carta.colorIdentity){
        carta.colorIdentity.map(color=>{ colores.push(color) });
      }
      if(carta.userMetadata.tipo == "main"){
        mazo.dataValues.main.push(carta);
      }else{
        mazo.dataValues.side.push(carta);
      }
    })
    //limpio los colores
    colores = colores.filter(function(item) {
       return seen.hasOwnProperty(item) ? false : (seen[item] = true);
   }).join("");

  return ReS(res, {mazo:mazo.toWeb()});
  //evaluo si mantiene los colores
  if(mazo.dataValues.manaCost != colores){
    mazo.update({
      manaCost: colores
    });
  }
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
