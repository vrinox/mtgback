const Chat = require('../models').Chat;
const Mensaje = require('../models').Mensaje;

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, chats;
    let Info = req.body;

    [err, chat] = await to(Chat.create(Info));
    if(err) return ReE(res, {success:false, error:err}, 422);

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
      let mensajes;
      [err,mensajes] = await to(Mensaje.findAll({
        limit: 20,
        where: {
          "ChatId":chat.id
        },
        order: [ [ 'createdAt', 'DESC' ]]
      }));
      chat.mensajes = mensajes.map((mensaje)=>{return mensaje.toWeb()});
      return chat;
    }));
    return ReS(res, {chats:chats,success:true});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');

    [err, chat] = await to(Chat.findOne({where:{"id":req.params.id}}));
    if(err) return ReE(res, "err encontrando formato");

    return ReS(res, {chat:chat.toWeb(),success:true});
}
module.exports.get = get;
