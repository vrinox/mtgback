
module.exports = async function(socket,server){
  socket.on("gps",(data)=>{
    console.log(data);
    server
      .getCliente(data.usuario)
      .then((cliente)=>{
        cliente.ubicacion = data.latlng;
        console.log("llego",cliente.ubicacion);
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