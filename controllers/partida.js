const Duelo   = require('../models').Duelo;
const Partida = require('../models').Partida;
const DetallePartida = require('../models').DetallePartida;
const decorar = require('../services/decorador')

const create = async function(solicitud){
    return new Promise(async (resolve,reject)=>{        
      let err, partida;

      [err, partida] = await to(Partida.create({
        DueloId : solicitud.dueloId,
      }));
      if(err) reject(err);
      [err, PartidaEmisor] = await to(DetallePartida.create({
        UsuarioId : solicitud.emisor.id,
        MazoId    : solicitud.emisor.deck,
        PartidaId : partida.id
      }));      
      if(err) reject(err);
      [err, PartidaReceptor] = await to(DetallePartida.create({
        UsuarioId : solicitud.receptor.id,
        MazoId    : solicitud.receptor.deck,
        PartidaId : partida.id
      }));      
      if(err) reject(err);

      get(partida.id).then((partidaDecorada)=>{
        console.log('[Partida]:enviar',partidaDecorada);        
        resolve(partidaDecorada);
      })
    })    
}


module.exports.create = create;
const get = async function(idPartida){
  let err,partida;
  return new Promise(async (resolve,reject)=>{
    [err, partida] = await to(Partida.findOne({
      include:[
        {"model":Duelo}
      ],
      where:{
        id:idPartida
      }
    }));
    if(err){
      reject(err);
    }else{     
      decorar.partida(partida.toWeb()).then((partidaDecorada)=>{
        resolve(partidaDecorada);
      });
    }
  })
}

module.exports.get = get;

const Eliminar = function(idDuelo){
  return new Promise(async (resolve,reject)=>{
    
    [err, duelo] = await to(Duelo.findOne({where:{"id":idDuelo}}));
    if(err) reject("err encontrando duelo");

    [err, duelo] = await to(duelo.destroy());
    if(err) reject('Ha ocurrido un error mientras se eliminama el duelo') 

    resolve()
  })
}

module.exports.Eliminar = Eliminar;