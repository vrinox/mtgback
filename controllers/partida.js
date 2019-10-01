const Duelo   = require('../models').Duelo;
const Partida = require('../models').Partida;
const decorar = require('../services/decorador')

const create = async function(solicitud){
    return new Promise(async (resolve,reject)=>{        
      let err, partida;

      [err, partida] = await to(Partida.create({
        dueloId : solicitud.dueloId
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
  return new Promise((resolve,reject)=>{
    [err, partida] = await to(Partida.findOne({
      include:[
        {"model":Duelo,"as":"duelo"}
      ],
      where:{
        id:idPartida
      }
    }));
    if(err){
      reject(err);
    }else{     
      partida = decorar.armarPartida(partida.toWeb());
      resolve(duelo.toWeb());
    }
  })
}

module.exports.get = get;

const Eliminar = function(idDuelo){
  return new Promise((resolve,reject)=>{
    
    [err, duelo] = await to(Duelo.findOne({where:{"id":idDuelo}}));
    if(err) reject("err encontrando duelo");

    [err, duelo] = await to(duelo.destroy());
    if(err) reject('Ha ocurrido un error mientras se eliminama el duelo') 

    resolve()
  })
}

module.exports.Eliminar = Eliminar;