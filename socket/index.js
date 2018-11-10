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
    this.clientes.forEach((cliente)=>{
      if(cliente.usuario.id === usuarioId){
        resolve(cliente);
      }
    });
    if(!encontrado){
      reject(new Error("cliente no se encuentra conectado"));
    }
  });
}
Servidor.getUsuario = async function(usuarioId){
  let err, usuario;
  [err, usuario] = await to(Usuario.findOne({"where":{"id":usuarioId}}));
  return usuario;
};

Servidor.add = function(socket,usuario){
  let cliente = {
    socket   : socket,
    usuario  : usuario,
    ubicacion: null
  }
  this.remove(cliente);
  this.clientes.push(cliente);
}
Servidor.remove = function(oldCliente){
  this.clientes = this.clientes.filter((newCliente)=>{
    if(oldCliente.usuario){
      return newCliente.usuario.id != oldCliente.usuario.id
    }else{
      return false;
    }
  });
}

Servidor.getClienteById = function(socketId){
  return this.clientes.find((cliente)=>{
    return cliente.socket.id == socketId;
  })
}

Servidor.inicializarEventos = function(socket){
  require('./notificacion')(socket);
  require('./chat')(socket,this);
  require('./gps')(socket,this);
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
module.exports.Servidor = Servidor;
