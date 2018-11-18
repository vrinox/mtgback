module.exports = async function(socket,server){
  socket.on("gps",(data)=>{
    server
      .getCliente(data.usuario)
      .then((cliente)=>{
        cliente.ubicacion = data.latLng;
        cliente.cercanos = server.clientes.filter((otherClient)=>{
          if(otherClient.ubicacion && cliente.usuario.id !== otherClient.usuario.id){
            console.log(server.gpsHelper);            
            console.log(server.gpsHelper.obtenerDistancia(cliente,otherClient));            
            return server.gpsHelper.obtenerDistancia(cliente,otherClient) <= server.distaciaMax;
          }else{
            return false;
          }
        });
      })
      .catch((err)=>{
        console.log("GPS:",err);
      })
  });
  socket.on("gps:disponibles",(data)=>{
    console.log("pidio disponibles",data);
    let ubicaciones = server.clientes.map((cliente)=>{
      if(cliente.usuario){
        return {
          usuario: cliente.usuario,
          coords : cliente.ubicacion
        }
      }else{
        return null;
      }
    }).filter((ubicacion)=>{
      return ubicacion !== null;
    });
    socket.emit("gps:disponibles",{ubicaciones:ubicaciones})
  })
}