module.exports = async function(socket,server){
  socket.on("gps",(data)=>{
    server
      .getCliente(data.usuario)
      .then((cliente)=>{
        cliente.ubicacion = data.latLng;
        cliente.cercanos = server.clientes.filter((otherClient)=>{
          if(otherClient.ubicacion && cliente.usuario.id !== otherClient.usuario.id){            
            return server.gpsHelper.obtenerDistancia(cliente,otherClient) <= server.distaciaMax;
          }else{
            return false;
          }
        }).map((newClient)=>{
          return {
            usuario   : newClient.usuario,
            ubicacion : newClient.ubicacion
          }
        });
      })
      .catch((err)=>{
        console.log("GPS:",err);
      })
  });
  socket.on("gps:disponibles",(data)=>{
    console.log("pidio disponibles",data);
    let cliente = server.getClienteById(socket.id);
    socket.emit("gps:disponibles",{ubicaciones:cliente.cercanos})
  })
}