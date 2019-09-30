const Duelo       = require('../models').Duelo;
const Usuario     = require('../models').Usuario;
const Invitacion  = require('./invitacion');
const Servidor    = require('../socket/servidor');

const create = async function(retador,retado,dueloInfo){
    return new Promise(async (resolve,reject)=>{        
      let err, duelo,dueloIncompleto;

      [err, dueloIncompleto] = await to(Duelo.create({
        tipo:dueloInfo.tipo,
        vencimiento : dueloInfo.vencimiento,
        idRetado    : retado.id,
        idRetador   : retador.id,
        imagesrc    : retador.imagesrc
      }));
      if(err) reject(err);
      [err, duelo] = await to(Duelo.findOne({
        include:[
          {"model":Usuario,"as":"retador"},
          {"model":Usuario,"as":"retado"}
        ],
        where:{
          id:dueloIncompleto.id,
        }
      }));
      if(err) reject(err);
  
      resolve(duelo.toWeb());
    })    
}

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, duelos, usuario;
    usuario = req.user;

    [err, duelos] = await to(Duelo.findAll({
      include:[
        {"model":Usuario,"as":"retador"},
        {"model":Usuario,"as":"retado"}
      ],
      where:{
        $or:[
          {idRetador:usuario.id},
          {idRetado:usuario.id}
        ]
      }
    }));
    let duelosJson = duelos.map(duelo => {
      return duelo.toWeb();
    });
    return ReS(res, {duelos:duelosJson});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idDuelo, duelo, usuario;
    usuario = req.user;
    idDuelo = req.body.idDuelo;
    [err, duelo] = await to(Duelo.findOne({
      include:[
        {"model":Usuario,"as":"retador"},
        {"model":Usuario,"as":"retado"}
      ],
      where:{
        id:idDuelo,
        $or:[
          {idRetador:usuario.id},
          {idRetado:usuario.id}
        ]
      }
    }));
    if(err) return ReE(res, "err encontrando duelo");

    return ReS(res, {duelo:duelo.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, duelo;

    [err, duelo] = await to(Duelo.findOne({where:{"id":req.body.idDuelo}}));
    if(err) return ReE(res, "err encontrando duelo");

    duelo.set(req.body);

    [err, duelo] = await to(duelo.save());
    if(err){
        return ReE(res, {success:false, error:err});
    }
    return ReS(res, {duelo:duelo.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){

  Eliminar(req.body.idDuelo).then(()=>{
    return ReS(res, {message:'Duelo eliminado'}, 204);
  }).catch((err)=>{
    return ReE(res, err);
  })

  
}
module.exports.remove = remove;

const crearInvitacion = async function(req, res){
  emisor      = req.user,
  receptorId  = req.body.invitado,
  vencimiento = new Date().setDate(new Date().getDate() + 3),//tres dias para vencerse
  tipo        = 'D';
  titulo      = "invitacion  a un duelo";
  contenido   = emisor.username+" te ha retado";

  Invitacion.create(emisor,receptorId,vencimiento,tipo,titulo,contenido)
  .then(([notificacion,invitacion])=>{
    let mensaje = {
      titulo        : notificacion.titulo,
      contenido     : notificacion.contenido,
      group_messaje : invitacion.titulo
    }
    let data = {
      "tipo"        :"invitacion",
      "emisor"      :emisor.id,
      "notificacion":notificacion,
      "invitacion"  :invitacion
    };
    return Servidor.enviarNotificacion(emisor,receptorId,"INVITACION_DUELO",data,mensaje)
  })
  .then((response)=>{
    return ReS(res,{"success":true,"message":response},200);
  })
  .catch((error)=>{
    return ReE(res,{"success":false,"error":error},422);
  });
  
}
module.exports.crearInvitacion = crearInvitacion;


const aceptar = async function(req, res){
  let retado = req.user;
  Invitacion
  .get(req.params.id)
  .then((invitacion)=>{
    let notificacion = invitacion.Notificacion;
    let mensaje = {
      titulo        : "Reto Aceptado",
      contenido     : retado.username+' acepto tu reto',
      group_messaje : "Retos"
    };
    let usuarioRetador;
    Servidor.getUsuario(invitacion.idInvitado)
    .then((retador)=>{
      usuarioRetador = retador;
      return create(retador,retado,{"tipo":"A","vencimiento": new Date().setDate(new Date().getDate() + 3)})
    }).then((duelo)=>{
      let data = {
        "tipo"  : "reto",
        "duelo" : duelo.id
      }
      return Promise.all([
        //destruyo la invitacion
        invitacion.destroy(),
        //guardo los cambios en la notificacion
        notificacion.destroy(),
        //envio respuesta
        Servidor.enviarNotificacion(retado,usuarioRetador.id,"INVITACION_DUELO",data,mensaje)
      ])
    })
    .then(()=>{
      return ReS(res, {"success":true,"message":"Duelo iniciado"});
    })    
  })
  .catch((err)=>{
    return ReE(res,{"success":false,"error":err},422);
  });
}
module.exports.aceptar = aceptar;

const rechazar = async function(req, res){
  Invitacion
  .get(req.params.id)
  .then((invitacion)=>{
    let notificacion = invitacion.Notificacion;
    return Promise.all([
      //destruyo la invitacion
      invitacion.destroy(),
      //guardo los cambios en la notificacion
      notificacion.destroy()]
    ).catch((err)=>{
      console.log(err);
    });
  })
  .then(()=>{
    return ReS(res, {"success":true,"message":"invitacion rechazada"});
  })
  .catch((err)=>{
    return ReE(res,{"success":false,"error":err},422);
  });
}
module.exports.rechazar = rechazar;

const Eliminar = async function(idDuelo){
  return new Promise( async (resolve,reject)=>{
    
    [err, duelo] = await to(Duelo.findOne({where:{"id":idDuelo}}));
    if(err) reject("err encontrando duelo");

    [err, duelo] = await to(duelo.destroy());
    if(err) reject('Ha ocurrido un error mientras se eliminama el duelo') 

    resolve()
  })
}