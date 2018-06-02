const Usuario = require('../models').Usuario;
var Servidor = {};
Servidor.clientes = [];
Servidor.io       = null;

Servidor.getCliente = function(usuarioId){
  return new Promise((resolve,reject)=>{
    let encontrado = false;
    this.clientes.forEach((socket)=>{
      if(socket.usuario.id === usuarioId){
        resolve(socket);
      }
    });
    if(!encontrado) resolve(null);
  });
}

Servidor.inicializarEventos = function(socket){
  require('./notificacion')(socket);
}
const init = function(io){
  Servidor.io = io;
  //en caso de uso de handshake
  io.use(async (socket,next)=>{
    const UID = socket.handshake.query.usuario;
    let err,usuario;
    [err,usuario] = await to(Usuario.findOne({"where":{"id":UID}}));
    if(err) next(new Error('Socket: authentication error'));
    socket.usuario = usuario;
    next();
  });
  io.on('connection', (socket) => {
    console.log('Socket: usuario conectado');
    socket.on('error',(err)=>{
      console.log("Socket error:",err);
    });
    //auth en caso que no se pueda usar
    socket.on('auth',async (data)=>{
      [err,usuario] = await to(Usuario.findOne({"where":{"id":data.usuario}}));
      if(err){
        socket.emit('auth',{"success":false,"error":err});
      }else{
          socket.usuario = usuario;
          socket.emit("auth",{success:true});
          console.log("SOCKET: usuario "+socket.usuario.username+" auntenticado");
          Servidor.clientes.push(socket);
          Servidor.inicializarEventos(socket);
      }
    });
  });
}
module.exports.init = init;
module.exports.Servidor = Servidor;
