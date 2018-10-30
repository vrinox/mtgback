const Lista        = require('../models').lista;
const Carta        = require('../models').Carta;
const DetalleLista = require('../models').DetalleLista;
const decorar      = require('../services/decorador');

const agregarCarta = async function(req, res){
  let err, userMetadata, ListaId, oldCarta, newCarta, carta;
  ListaId = req.params.idLista;
  /*
    userMetadata
    {
      id      : id de la bd
      cantidad: cantidad de esta carta en la lista
      tipo    : main o side
      idCarta : id de la api
      idLista : id de la lista
    }
  */
  oldCarta = req.body;
  //busco en caso de que esa carta ya este en la bd
  [err, newCarta] = await to(Carta.findOne({where:{id:oldCarta.id}}));
  if(err) ReE(res, {success:false, error:err});
  //reviso si esta
  if(!newCarta){
    oldCarta = decorar.carta(oldCarta,"join",1);
    [err, newCarta] = await to(Carta.create(oldCarta));
    if(err) ReE(res, {success:false, error:err});
    newCarta = decorar.carta(newCarta,"split",2);
    req.body = decorar.carta(req.body,"split",3);
  }
  userMetadata = oldCarta.userMetadata;
  userMetadata.idCarta = newCarta.id;
  userMetadata.ListaId = idLista;
  //agrego al detalle
  console.log("CARTA: ",userMetadata);
  console.log("LISTA: ",idLista);
  [err, userMetadata] = await to(DetalleLista.create(userMetadata));
  if(err) ReE(res, {success:false, error:err});
  //preparo el envio
  carta = decorar.carta(req.body,"join",4);
  carta = decorar.carta(carta,"split",5);

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
      cantidad: cantidad de esta carta en la lista
      tipo    : main o side
      idCarta : id de la api
    }
  */
  userMetadata = req.body.userMetadata;
  userMetadata.ListaId = req.params.idLista;
  idCarta = req.params.idCarta;
  [err, oldCarta] = await to(DetalleLista.findOne({where:{"id":idCarta}}));
  if(err) ReE(res, {success:false, error:err});

  oldCarta.set(userMetadata);

  [err, newCarta] = await to(oldCarta.save());
  if(err)  return ReE(res, {success:false, error:err});

  fullCarta = req.body;
  fullCarta.userMetadata = newCarta.toWeb();

  return ReS(res, {"carta":fullCarta});
}
module.exports.actualizarCarta = actualizarCarta;

const eliminarCarta = async function(req, res){
  let err, idCarta, carta;
  idCarta = req.params.idCarta;
  [err, carta] = await to(DetalleLista.findOne({where:{"id":idCarta}}));
  if(err) return ReE(res, "err encontrando lista");

  [err, carta] = await to(carta.destroy());
  if(err) return ReE(res, 'Ha ocurrido un error mientras se eliminaba el lista');

  return ReS(res, {message:'Carta Eliminada'}, 200);
}
module.exports.eliminarCarta = eliminarCarta;
