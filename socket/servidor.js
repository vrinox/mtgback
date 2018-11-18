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
      console.log("Busqueda por id: un cliente",cliente.socket.id);  
      return cliente.socket.id == socketId;
    });
  }

  Servidor.getUsuario = async function(usuarioId){
    let err, usuario;
    [err, usuario] = await to(Usuario.findOne({"where":{"id":usuarioId}}));
    return usuario;
  };

  Servidor.add = function(socket,usuario,llamado){
    let cliente = {
      socket   : socket,
      usuario  : usuario,
      ubicacion: null
    }
    this.remove(cliente.socket,"add"+llamado);
    this.clientes.push(cliente);
  }

  Servidor.remove = function(socket,llamado){
    console.log("socket id del remove("+llamado+"): ",socket.id);
    let oldCliente = this.getClienteById(socket.id);
    this.clientes = this.clientes.filter((newCliente)=>{
      if(oldCliente.usuario){
        return newCliente.usuario.id != oldCliente.usuario.id
      }else{
        return false;
      }
    });
  }

  Servidor.inicializarEventos = function(socket){
    require('./notificacion')(socket);
    require('./chat')(socket,this);
    require('./gps')(socket,this);
  }

  Servidor.buscarCercanos = function(cliente){
    return new Promise(async (resolve,reject)=>{
      if(this.clientes.length){
        cliente.cercanos = this.clientes.filter((otherClient)=>{
          if(otherClient.ubicacion && cliente.usuario.id !== otherClient.usuario.id){   
            let distancia = this.gpsHelper.obtenerDistancia(cliente,otherClient);
            console.log("distancia:",distancia);          
            return distancia < this.distaciaMax;
          }else{
            return false;
          }
        }).map((newClient)=>{
          return {
            usuario   : newClient.usuario,
            ubicacion : newClient.ubicacion
          }
        });
        await this.add(cliente,"cercanos");
      }
      resolve();
    });
  }
module.exports = Servidor;