const Usuario = require('../models').Usuario;
const init = function(io){
  //en caso de uso de handshake
  io.use(async (socket,next)=>{
    const UID = socket.handshake.query.usuario;
    let err,usuario;
    [err,usuario] = await to(Usuario.findOne({"where":{"id":UID}}));
    if(err) next(new Error('authentication error'));
    socket.usuario = usuario;
    next();
  });
  io.on('connection', (socket) => {
    console.log('usuario conectado');
    socket.on('error',(err)=>{
      console.log("socket error:",err);
    });
    //auth en caso que no se pueda usar
    socket.on('auth',async (data)=>{
      [err,usuario] = await to(Usuario.findOne({"where":{"id":data.usuario}}));
      if(err){
        socket.emit('auth',{"success":false,"error":err});
      }else{
          socket.usuario = usuario;
          socket.emit("auth",{success:true});
          console.log("usuario auntenticado:",socket.usuario.username);
      }
    });
    require('./notificacion')(socket);
  });
}
module.exports.init = init;
