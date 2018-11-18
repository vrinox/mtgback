const Usuario = require('../models').Usuario;
const OneSignal = require('onesignal-node');
const Servidor = require('./servidor');

const init = function(io){
  initSocket(io);
  initOneSignal();
}
const initOneSignal = function(){
  if(CONFIG.environment == "prod"){
    console.log("-------------","onesignal:ON","----------------");
    var oneClient = new OneSignal.Client({
      userAuthKey: CONFIG.onesignal.userAuthKey,
      app: { appAuthKey: CONFIG.onesignal.appAuthKey, appId: CONFIG.onesignal.appId }
    });
    Servidor.onesignal.client = oneClient;
  }else{
    console.log("-------------","onesignal:OFF","----------------");
  }
};
const initSocket = function(io){
  //middleware
  io.use(async (socket,next)=>{
    //se pregunta el socket no posee usuario relacionado
    if(!socket.usuario){
      //posee handshake
      if(socket.handshake.query){
        //dentro del hanshake posee el id del usuario
        if(socket.handshake.query.usuario){
          console.log("SOCKET:MIDDLEWARE",socket.handshake.query);
          const UID = socket.handshake.query.usuario;
          let err,usuario;
          [err,usuario] = await to(Usuario.findOne({"where":{"id":UID}}));
          if(err) next(new Error('Socket: authentication error'));
          socket.emit("autenticado",{data:"autenticado"});
          Servidor.add(socket,usuario);
          Servidor.inicializarEventos(socket);
          next();
        }else{
          next(new Error('Authentication error'));
        }
      }else{
        next(new Error('Authentication error'));
      }
    }else{
      next();
    }
  });
  io.on('connection', (socket) => {
    let cliente = Servidor.getClienteById(socket.id)
    console.log('SOCKET: usuario '+cliente.usuario.username+' conectado');
    socket.on('error',(err)=>{
      console.log("Socket error:",err);
    });
    socket.on('disconnect',()=>{
      console.log('SOCKET: usuario '+cliente.usuario.username+' desconectado');
      Servidor.remove(socket);
    })
  });
  Servidor.io = io;
}
module.exports.init = init;
