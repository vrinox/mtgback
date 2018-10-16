const Chat      = require('../models').Chat;
const Mensaje   = require('../models').Mensaje;
const Usuario   = require('../models').Usuario;
const decorar   = require('../services/decorador');
const Sequelize = require('sequelize');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, chats;
    let Info = req.body;

    [err, chat] = await to(findForType(Info.usuario2.id,Info.tipo));
    console.log(chat);
    if(!chat.length){
      [err, chat] = await to(Chat.create(Info));
      if(err) return ReE(res, {success:false, error:err}, 422);
    }
    const newId = chat.id;
    [err, chat] = await to(Chat.findOne({
      include:[
        {"model":Usuario,"as":"usuario1"},
        {"model":Usuario,"as":"usuario2"}
      ],
      where:{"id":newId}
    }));

    return ReS(res,{chat:chat.toWeb(),success:true}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, chats,
    usuario = req.user;

    [err, chats] = await to(Chat.findAll({
      include:[
        {"model":Usuario,"as":"usuario1"},
        {"model":Usuario,"as":"usuario2"}
      ],
      where:{
        $or:[
          {idUsuario1:usuario.id},
          {idUsuario2:usuario.id}
        ]
      }
    }));
    chats = await Promise.all(chats.map(async(chat) => {
        return chat.toWeb();
    }));
    return ReS(res, {chats:chats,success:true});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    [err, chat] = await to(Chat.findOne({where:{"id":req.params.id}}));
    if(err) return ReE(res, "err encontrando chat");

    return ReS(res, {chat:chat.toWeb(),success:true});
}
module.exports.get = get;

const getMsg = async function(req,res){
  let mensajes,ChatId = req.params.id;
  [err,mensajes] = await to(Mensaje.findAll({
    include:[
      {"model":Usuario,"as":"emisor"},
      {"model":Usuario,"as":"receptor"}
    ],
    limit: 20,
    where: {
      "ChatId":ChatId
    },
    order: [[ 'createdAt', 'DESC' ]]
  }));
  if(err) return ReE(res, err);
  mensajes = mensajes.map((mensaje)=>{
    return mensaje.toWeb();
  })
  return ReS(res, {"mensajes":mensajes,"success":true});
}
module.exports.getMsg = getMsg;

const findForType = async function(receptorId,tipo){
  var Op = Sequelize.Op;
  let [error,resultado] = await to(Chat.findAll({
    where:{
      [Op.or]: [{"idUsuario1": receptorId}, {"idUsuario2": receptorId}],
      [Op.and]: [{"tipo":tipo}]
    }
  }))
  return resultado;
}
