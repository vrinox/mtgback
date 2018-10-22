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
      wrapper.usuario = await this.getUsuario(usuarioId);
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

Servidor.add = function(socket){
  this.remove(socket);
  this.clientes.push(socket);
}
Servidor.remove = function(socket){
  this.clientes = this.clientes.filter((cliente)=>{
    if(socket.usuario){
        return cliente.usuario.id != socket.usuario.id
    }else{
      return false;
    }
  });
}

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
          socket.usuario = usuario;
          console.log("este es el cambio");
          socket.emit("autenticado",{data:"autenticado"});
          console.log("SOCKET: id ",socket.id);
          Servidor.add(socket);
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
    console.log('SOCKET: usuario '+socket.usuario.username+' conectado');
    socket.on('error',(err)=>{
      console.log("Socket error:",err);
    });
    socket.on('disconnect',()=>{
      console.log('SOCKET: usuario '+socket.usuario.username+' desconectado');
      Servidor.remove(socket);
    })
  });
  Servidor.io = io;
}
module.exports.init = init;
module.exports.Servidor = Servidor;
