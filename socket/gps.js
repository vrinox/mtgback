
module.exports = async function(socket,server){
  socket.on("gps",(data)=>{
    server
      .getCliente(data.usuario)
      .then((cliente)=>{
        cliente.ultimaUbicacion = data.latlng;
      })
      .catch((err)=>{
        console.log("GPS:",err);
      })
  });
  socket.on("gps:disponibles",(data)=>{
    let ubicaciones = server.clientes.map((cliente)=>{
      if(cliente.usuario){
        return {
          usuario: cliente.usuario,
          coords : cliente.latlng
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