const Duelo   = require('../controllers/duelo');
const Partida = require('../controllers/partida');

module.exports = async function(socket,server){
  //ida
  socket.on("partida:solicitud",(data)=>{
    console.log("[Partida]:solicitada",data);
    server
      .getCliente(data.receptor.id)
      .then((cliente)=>{
        cliente.emit('partida:solicitud',data)
      })
      .catch((err)=>{
        console.log("[Partida]:",err);
      })
  });
  //retorno
  socket.on("partida:aceptada",(data)=>{    
    console.log("[Partida]:aceptada",data);
    Partida.create(data).then((partida)=>{
      server
        .getCliente()
        .then((cliente)=>{
          cliente.socket.emit('partida:aceptada',{partida:partida });
          socket.emit('partida:empieza',partida);
        })
    })
  })
  socket.on("partida:rechazada",(data)=>{    
    console.log("[Partida]:rechazada",data);
    server
      .getCliente(data.emisor.id)
      .then((cliente)=>{
        cliente.socket.emit('partida:rechazada',data)
        Duelo.Eliminar(data.dueloId).then(()=>{
          console.log("[Partida]:duelo eliminado")
        });
      })
  })
  socket.on("gps:stop",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    cliente.estado = false;
    server.update(cliente);    
  });
}