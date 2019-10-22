//imports
const Formato       = require('../models').Formato;
const Mazo          = require('../models').Mazo;
const Lista         = require('../models').Lista;
const Carta         = require('../models').Carta;
const Usuario       = require('../models').Usuario;
const DetalleMazo   = require('../models').DetalleMazo;
const DetalleLista  = require('../models').DetalleLista;
const DetallePartida= require('../models').DetallePartida;

const usuario = async function(newUsuario){
  let err,mazos,listas;
  [err, mazos] = await to(Mazo.findAll({
    include:[{
      model:Formato
    }],
    where:{"UsuarioId":newUsuario.dataValues.id}
  }));
  if(err) TE("error al buscar mazos del usuario "+newUsuario.dataValues.id,true);
  [err, listas] = await to(Lista.findAll({
    where:{"UsuarioId":newUsuario.dataValues.id}
  }));
  if(err) TE("error al buscar listas del usuario "+newUsuario.dataValues.id,true);
  [listas,mazos] = await Promise.all(
    [
      Promise.all(listas.map(async(newLista)=>{
        return await armarLista(newLista);
      })),
      Promise.all(mazos.map(async(newMazo)=>{
        return await armarMazo(newMazo);
      }))
    ]
  );
  newUsuario.dataValues.mazos = mazos;
  newUsuario.dataValues.listas = listas;
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
    return rellenarCarta(oldCarta);
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

const armarLista = async function(lista){
  let ListaId = lista.id;
  [err, cartas] = await to(DetalleLista.findAll({
    "include":[{
      "model":Carta,
      "as": "carta",
    }],
    "where":{"ListaId":ListaId}
  }));
  if(err) console.log(err);
  lista.dataValues.cartas = [];
  const mtgCartas = cartas.map(oldCarta =>{
    return rellenarCarta(oldCarta);
  });
  mtgCartas.forEach(newCarta => {
    newCarta = decorarCarta(newCarta,"split",112);
    lista.dataValues.cartas.push(newCarta);
  })
  return lista.toWeb();
}
module.exports.lista = armarLista;

const rellenarCarta = function(oldCarta){
  let newCarta = oldCarta.carta;
  newCarta.dataValues.userMetadata = {
    cantidad: oldCarta.cantidad,
    id      : oldCarta.id,
    tipo    : oldCarta.tipo,
    idCarta : oldCarta.idCarta,
  }
  return newCarta;
}

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

const decorarInvitacion = async function(notificacion){
    return new Promise(async (resolve,reject)=>{
      let newNot = notificacion.toWeb();
      let anfitrion = await notificacion.Invitacions[0].getUsuario();
      newNot.anfitrion = {
        id      : anfitrion.id,
        nombre  : anfitrion.nombre,
        apellido: anfitrion.apellido,
        username: anfitrion.username,
        imagesrc: anfitrion.imagesrc,
        deviceId: anfitrion.deviceId
      }
      newNot.invitacion = notificacion.Invitacions[0].toWeb();
      delete newNot.Invitacions;
      resolve(newNot);
    });
}
module.exports.invitacion = decorarInvitacion;

const extraerMensaje = function(mensaje){
  return {
    ChatId    : mensaje.ChatId,
    idEmisor  : mensaje.idEmisor,
    idReceptor: mensaje.idReceptor,
    estado    : mensaje.estado,
    contenido : mensaje.contenido
  };
}
module.exports.mensajeDB = extraerMensaje;

const armarPartida = async function(partida){
  let PartidaId = partida.id;
  [err, detalles] = await to(DetallePartida.findAll({
    "include":[
      {"model":Usuario},
      {"model":Mazo}
    ],
    "where":{"PartidaId":PartidaId}
  }));
  if(err) ReE(res, err);
    
  detalles.map(async (detalle)=>{
    if(detalle.UsuarioId == partida.Duelo.idRetador){
      partida.retador = {
        usuario : detalle.Usuario.dataValues,
        deck    : await armarMazo(detalle.Mazo.dataValues)
      }
    }else{
      partida.retado = {
        usuario : detalle.Usuario.dataValues,
        deck    : await armarMazo(detalle.Mazo.dataValues)
      }
    }
  })

  return partida;
}
module.exports.partida = armarPartida;