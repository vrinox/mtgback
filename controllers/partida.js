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

const Termino = function(partidaTerminada){
  return new Promise(async (resolve,reject)=>{
    let duelo,partida;
    [err, duelo] = await to(Duelo.findOne({where:{"id":partidaTerminada.duelo.id}}));
    if(err) reject("err encontrando duelo");

    [err, duelo] = await to(duelo.destroy());
    if(err) reject('Ha ocurrido un error mientras se eliminama el duelo') 
  
    [err, partida] = await to(Partida.findOne({where:{"id":partidaTerminada.id}}));
    if(err) reject('Ha ocurrido un error mientras se eliminama el duelo') 

    partida.set({
      UsuarioId: partida.id,
      fin: new Date().toISOString()
    });

    [err, partida] = await to(partida.save());
    if(err) reject('error mientras se actualiza la partida')
      
    resolve()
  })
}

module.exports.Termino = Termino;