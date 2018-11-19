const gpsHelper = require('../services/gpsHelper');

var Servidor = {};
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
    let cliente = {
      socket   : socket,
      usuario  : usuario,
      ubicacion: null
    }
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
  }

  Servidor.buscarCercanos = function(cliente){
    console.log("clientes:",this.clientes.map((cliente)=>{
      return cliente.usuario.username
    }));
    return new Promise(async (resolve,reject)=>{
      if(this.clientes.length){
        cliente.cercanos = this.clientes.filter((otherClient)=>{
          if(otherClient.ubicacion && cliente.usuario.id !== otherClient.usuario.id){   
            let distancia = this.gpsHelper.obtenerDistancia(cliente,otherClient);
            return distancia < this.distanciaMax;
          }else{
            return false;
          }
        }).map((newClient)=>{
          return {
            usuario : newClient.usuario.dataValues,
            coords  : newClient.ubicacion
          }
        });
        await this.update(cliente);
      }
      resolve();
    });
  }
module.exports = Servidor;