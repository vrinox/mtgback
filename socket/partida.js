const Duelo   = require('../controllers/duelo');
const Partida = require('../controllers/partida');

module.exports = async function(socket,server){
  socket.on("partida:solicitud",(data)=>{
    console.log("[Partida]:solicitud",data);
    server
      .getCliente(data.receptor.id)
      .then((cliente)=>{
        if(data.tipo == "solicitar"){
          //SOLICITADA
          cliente.socket.emit('partida:solicitud',data);
        }else if(data.tipo == "aceptada"){
          //ACEPTADA
          // console.log("[Partida]:aceptada",data);
          server
            .getCliente(data.emisor.id)
            .then((emisor)=>{
              //envio aceptada
              cliente.socket.emit('partida:solicitud',data);
              emisor.socket.emit('partida:solicitud',data);
              Partida.create(data).then((partida)=>{
                data.partida = partida;
                data.tipo = 'iniciar';
                cliente.socket.emit('partida:solicitud',data);
                emisor.socket.emit('partida:solicitud',data);
              })
            });
        }else if(data.tipo == "rechazada"){
          //RECHAZADA
          // console.log("[Partida]:rechazada",data);
          cliente.socket.emit('partida:rechazada',data)
          Duelo.Eliminar(data.dueloId).then(()=>{
            // console.log("[Partida]:duelo eliminado");
          });
        }else{          
          console.log("[Partida]:desconocida",data);
        }
      })
      .catch((err)=>{
        console.log("[Partida]:",err);
      });
  });
  socket.on("partida:datos",(data)=>{
    // console.log("[Partida]:datos",data);
    server
      .getCliente(data.receptor.id)
      .then((cliente)=>{        
        if(data.datos.tipo === 'termino'){
          Partida.Termino()
            .then(()=>{
              // partida terminada
            })
        }
        cliente.socket.emit('partida:datos',data);
      });
  });
  socket.on("gps:stop",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    cliente.estado = false;
    server.update(cliente);    
  });
}