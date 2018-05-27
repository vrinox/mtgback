const Usuario = require('../models').Usuario;
const init = function(io){
  io.use(async (socket,next)=>{
    const UID = socket.handshake.query.usuario;
    let err,usuario;
    [err,usuario] = await to(Usuario.findOne({"where":{"id":UID}}));
    if(err) next(new Error('authentication error'));
    socket.usuario = usuario;
    next();
  });
  io.on('connection', (socket) => {
    console.dir(socket.usuario);
  });
}
