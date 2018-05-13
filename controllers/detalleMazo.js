const Mazo = require('../models').Mazo;
const Carta = require('../models').Carta;
const DetalleMazo = require('../models').DetalleMazo;

const agregarCarta = async function(req, res){
  let err, userMetadata, MazoId, oldCarta, newCarta, carta;
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
  //busco en caso de que esa carta ya este en la bd
  [err, newCarta] = await to(Carta.findOne({where:{id:oldCarta.id}}));
  if(err) ReE(res, err);
  //reviso si esta
  if(!newCarta){
    oldCarta = decorarCarta(oldCarta,"join",1);
    [err, newCarta] = await to(Carta.create(oldCarta));
    if(err) ReE(res, err);
    newCarta = decorarCarta(newCarta,"split",2);
    req.body = decorarCarta(req.body,"split",3);
  }
  userMetadata = oldCarta.userMetadata;
  userMetadata.idCarta = newCarta.id;
  userMetadata.MazoId = req.params.idMazo;
  //agrego al detalle
  [err, userMetadata] = await to(DetalleMazo.create(userMetadata));
  if(err) ReE(res, err);
  //preparo el envio
  carta = decorarCarta(req.body,"join",4);
  carta = decorarCarta(carta,"split",5);

  carta.userMetadata = userMetadata.toWeb();
  //envio
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

  return ReS(res, {message:'Carta Eliminada'}, 200);
}
module.exports.eliminarCarta = eliminarCarta;

const decorarCarta = function(carta,tipo,numero){
  console.log(numero+":",carta);
  const campos = ["types","subtypes","colorIdentity"];
  if(tipo == "split"){
    campos.forEach(campo=>{
      if(carta.hasOwnProperty(campo) || carta.dataValues.hasOwnProperty(campo) && carta[campo] != null){
        carta[campo] = carta[campo].split('+');
        if(typeof carta[campo] == "string"){
          carta[campo] = [carta[campo]];
        }
      }
    });
  }else if(tipo == "join"){
    campos.forEach(campo=>{
      if(carta.hasOwnProperty(campo) || carta.dataValues.hasOwnProperty(campo) && carta[campo] != null){
        carta[campo] = carta[campo].join('+');
      }
    });
  }
  return carta;
}

module.exports.decorarCarta = decorarCarta;
