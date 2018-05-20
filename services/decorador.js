//imports
const Formato = require('../models').Formato;
const Mazo    = require('../models').Mazo;
const Carta   = require('../models').Carta;
const DetalleMazo = require('../models').DetalleMazo;

const usuario = async function(newUsuario){
  let err,mazos;
  [err, mazos] = await to(Mazo.findAll({
    include:[{
      model:Formato
    }],
    where:{"UsuarioId":newUsuario.dataValues.id}
  }));
  if(err) TE("error al buscar mazos de usuario "+newUsuario.dataValues.id,true);
  mazos = await Promise.all(mazos.map(async(newMazo)=>{
    return await armarMazo(newMazo);
  }))
  newUsuario.dataValues.mazos = mazos;
  return newUsuario;
}

module.exports.usuario = usuario;

const armarMazo = async function(newMazo){
  let MazoId = newMazo.id;
  [err, cartas] = await to(DetalleMazo.findAll({
    "include":[{
      "model":Carta,
      "as": "carta",
    }],
    "where":{"MazoId":MazoId}
  }));
  if(err) ReE(res, err);
  const mtgCartas = cartas.map(oldCarta =>{
    newCarta = oldCarta.carta;
    newCarta.dataValues.userMetadata = {
      cantidad: oldCarta.cantidad,
      id      : oldCarta.id,
      tipo    : oldCarta.tipo,
      idCarta : oldCarta.idCarta,
    }
    return newCarta;
  });

  //inicializo los valores del main y side
  newMazo.dataValues.main = [];
  newMazo.dataValues.side = [];
  //acumulo los colores
  let seen = {};
  let colores = [];
  //organizo cada carta en su espacio
  mtgCartas.forEach(newCarta => {
    newCarta = decorarCarta(newCarta,"split",112);
    if(newCarta.colorIdentity){
      newCarta.colorIdentity.map(color=>{ colores.push(color) });
    }
    if(newCarta.dataValues.userMetadata.tipo == "main"){
      newMazo.dataValues.main.push(newCarta);
    }else{
      newMazo.dataValues.side.push(newCarta);
    }
  })
  //limpio los colores
  colores = colores.filter(function(item) {
     return seen.hasOwnProperty(item) ? false : (seen[item] = true);
   }).join("");
   //evaluo si mantiene los colores
   if(newMazo.dataValues.manaCost != colores){
     newMazo.update({
       manaCost: colores
     });
   }
   return newMazo.toWeb();
}

module.exports.mazo = armarMazo;

const decorarCarta = function(carta,numero){
  const propiedades = ["types","subtypes","colorIdentity"];
  let poseePropiedad = false;
    propiedades.forEach(propiedad=>{
      //valido que el registro posea el propiedad a verificar
      if(carta.hasOwnProperty("dataValues")){
        if(carta.dataValues.hasOwnProperty(propiedad)){
          poseePropiedad = true;
        }
      }else if(carta.hasOwnProperty(propiedad)){
        poseePropiedad = true;
      }
      if(poseePropiedad && carta[propiedad] != null){
        if(typeof carta[propiedad] == "string"){ //en caso de que sea string
          if(carta[propiedad].includes('+')){
            carta[propiedad] = carta[propiedad].split('+');
          }else{
            carta[propiedad] = [carta[propiedad]];
          }
        }else if(Array.isArray(carta[propiedad])){ //en caso de que sea array
          carta[propiedad] = carta[propiedad].join('+');
        }
      }
    });
  return carta;
}

module.exports.carta = decorarCarta;