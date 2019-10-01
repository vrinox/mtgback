const gpsHelper = require('../services/gpsHelper');
const OneSignal = require('onesignal-node');
const Usuario = require('../models').Usuario;
const Cliente = require('./cliente');

var Servidor = {
  estado:"sinArrancar"
};

Servidor.init = function(){
  Servidor.estado = "inicializado";
  Servidor.clientes = [];
  Servidor.io       = null;
  Servidor.gpsHelper = gpsHelper;
  Servidor.distanciaMax = 10000; //metros para detectar jugadores
  Servidor.onesignal= {
    client:null,
    groupKeys:{
      "INVITACION_AMIGO":1,
      "INVITACION_DUELO":2,
      "MENSAJE":3
    }
  };
  console.log("[Servidor]=",this.estado);
}


  Servidor.getCliente =  function(usuarioId){
    return new Promise(async (resolve,reject)=>{
      let encontrado = false;
      this.clientes.forEach((cliente)=>{
        if(cliente.usuario.id === usuarioId){
          encontrado = true;
          resolve(cliente);
        }
      });
      if(!encontrado){
        console.log('[Error]: cliente '+usuarioId+' no se encuentra conectado');
        reject(null);
      }
    });
  }

  Servidor.getClienteById = function(socketId){
    return this.clientes.find((cliente)=>{
      return cliente.socket.id == socketId;
    });
  }

  Servidor.getUsuario = async function(usuarioId){
    let err, usuario;
    [err, usuario] = await to(Usuario.findOne({"where":{"id":usuarioId}}));
    return usuario;
  };

  Servidor.add = function(socket,usuario){
    
    let cliente = new Cliente({
      socket   : socket,
      usuario  : usuario,
      ubicacion: null,
      estado   : false
    });
    
    this.remove(cliente.socket);
    this.clientes.push(cliente);
  }

  Servidor.update = function(cliente){
    this.remove(cliente.socket);
    this.clientes.push(cliente);
  }

  Servidor.remove = function(socket){
    this.clientes = this.clientes.filter((newCliente)=>{
      return newCliente.socket.id != socket.id
    });
  }

  Servidor.inicializarEventos = function(socket){
    require('./notificacion')(socket);
    require('./chat')(socket,this);
    require('./gps')(socket,this);
    require('./partida')(socket,this);
  }

  Servidor.buscarCercanos = function(cliente){
    return new Promise(async (resolve,reject)=>{
      if(this.clientes.length){
        cliente.cercanos = this.clientes.filter((otherClient)=>{
          if(otherClient.ubicacion && cliente.usuario.id !== otherClient.usuario.id){
            if(otherClient.estado){
              let distancia = this.gpsHelper.obtenerDistancia(cliente,otherClient);
              return distancia < this.distanciaMax;
            }
          }else{
            return false;
          }
        }).map((newClient)=>{
          return {
            usuario : newClient.usuario.dataValues,
            coords  : newClient.ubicacion,
            usuarioId: newClient.usuario.dataValues.id
          }
        });
        await this.update(cliente);
      }
      resolve();
    });
  }

  Servidor.enviarNotificacion =  async function(emisor,receptorId,grupo_notificacion,data,mensaje){
    
    return new Promise(async (resolve,reject)=>{
      this
        .getUsuario(receptorId)
        .then((receptor)=>{
          if(receptor.deviceId){
            let oneSignal = this.onesignal;
            let push = new OneSignal.Notification({
              "contents": {
                  "en" : mensaje.contenido,
                  "es" : mensaje.contenido
              }
            });
            push.setTargetDevices([receptor.deviceId]);
            push.setParameter("headings",{
              "en" : mensaje.titulo,
              "es" : mensaje.titulo
            });
            push.setParameter("data", data);
            push.setParameter("large_icon",emisor.imagesrc);
            push.setParameter("android_group",oneSignal.groupKeys[grupo_notificacion]);
            push.setParameter("android_group_message", mensaje.group_messaje);

            oneSignal.client.sendNotification(push)
              .then((response)=>{
                resolve("Invitacion Enviada de forma exitosa");
                console.log("ONESIGNAL: notificacion enviada",response.data, response.httpResponse.statusCode)
              })
              .catch((err)=>{console.log("error enviando push",err)});
          }else{
            resolve("Enviado:El usuario no posee dispositivo asosciado");
            console.log("no posee deviceId");
          }
        });
    });
  }
module.exports = Servidor;