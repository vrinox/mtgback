const Usuario = require('../models').Usuario;
const OneSignal = require('onesignal-node');
var Servidor = {};
Servidor.clientes = [];
Servidor.io       = null;
Servidor.onesignal= {
  client:null,
  groupKeys:{
    "INVITACION_AMIGO":1,
    "INVITACION_DUELO":2,
    "MENSAJE":3
  }
};

Servidor.getCliente =  function(usuarioId){
  return new Promise(async (resolve,reject)=>{
    let encontrado = false;
    this.clientes.forEach((socket)=>{
      if(socket.usuario.id === usuarioId){
        resolve(socket);
      }
    });
    if(!encontrado){
      let err,
      wrapper = {
        usuario:null,
        emit: null
      };
      wrapper.usuario = this.getUsuario(usuarioId);
      if(wrapper.usuario){
        resolve(wrapper);
      }else{
        resolve(null);
      }
    }
  });
}
Servidor.getUsuario = async function(usuarioId){
  let err, usuario;
  [err, usuario] = await to(Usuario.findOne({"where":{"id":usuarioId}}));
  return usuario;
};

Servidor.inicializarEventos = function(socket){
  require('./notificacion')(socket);
  require('./chat')(socket,this);
}

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
  Servidor.io = io;
}
module.exports.init = init;
module.exports.Servidor = Servidor;
