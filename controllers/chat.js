const Chat = require('../models').Chat;

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, chats;
    let Info = req.body;

    [err, chat] = await to(Chat.create(Info));
    if(err) return ReE(res, {success:false, error:err}, 422);

    return ReS(res,{chat:chat.toWeb(),success:true}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, chats,
    usuario = req.user;

    [err, chats] = await to(Chat.findAll({
      where:{
        $or:[
          {idUsuario1:usuario.id},
          {idUsuario2:usuario.id}
        ]
      }
    }));
    chats = formatos.map(chat => {
      return chat.toWeb();
    });
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
