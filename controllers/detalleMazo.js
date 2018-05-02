const Mazo = require('../models').Mazo;
const Carta = require('../models').Carta;
const DetalleMazo = require('../models').DetalleMazo;

const agregarCarta = async function(req, res){
  let err, carta, userMetadata,MazoId,oldCarta;
  /*
    userMetadata
    {
      id      : id de la bd
      cantidad: cantidad de esta carta en el mazo
      tipo    : main o side
      idCarta : id de la api
    }
  */
  oldCarta = req.body;
  userMetadata = oldCarta.userMetadata;
  userMetadata.MazoId = req.params.idMazo;

  [err, carta] = await to(Carta.findOne({where:{id:oldCarta.id}}));
  if(err) ReE(res, err);

  if(!carta){
    oldCarta = decorarCarta(carta);
    [err, carta] = await to(Carta.create(oldCarta));
    if(err) ReE(res, err);
  }

  userMetadata.idCarta = carta.id;
  [err, userMetadata] = await to(DetalleMazo.create(userMetadata));
  if(err) ReE(res, err);
  carta = req.body;
  carta.userMetadata = userMetadata.toWeb();

  return ReS(res, {"carta":carta});
}

module.exports.agregarCarta = agregarCarta;

const actualizarCarta = async function(req, res){
  let err, idCarta, userMetadata, oldCarta, newCarta,fullCarta;
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
  idCarta = req.params.idCarta;
  [err, oldCarta] = await to(DetalleMazo.findOne({where:{"id":idCarta}}));
  if(err) ReE(res, err);

  oldCarta.set(userMetadata);

  [err, newCarta] = await to(oldCarta.save());
  if(err)  return ReE(res, err);

  fullCarta = req.body;
  fullCarta.userMetadata = newCarta.toWeb();

  return ReS(res, {"carta":fullCarta});
}

module.exports.actualizarCarta = actualizarCarta;

const eliminarCarta = async function(req, res){
  let err, idCarta, carta;
  idCarta = req.params.idCarta;
  [err, carta] = await to(DetalleMazo.findOne({where:{"id":idCarta}}));
  if(err) return ReE(res, "err encontrando mazo");

  [err, carta] = await to(carta.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminama el mazo');

  return ReS(res, {message:'Mazo eliminado'}, 200);
}
module.exports.eliminarCarta = eliminarCarta;

function decorarCarta(carta){
  carta.types = carta.types.join("+");
  carta.subtypes = carta.subtypes.join("+");
  carta.colorIdentity = carta.colorIdentity.join("+");
  return carta;
}
