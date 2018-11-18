module.exports = async function(socket,server){
  socket.on("gps",(data)=>{
    server
      .getCliente(data.usuario)
      .then(async (cliente)=>{
        cliente.ubicacion = data.latLng;
        await server.buscarCercanos(cliente);
      })
      .catch((err)=>{
        console.log("GPS:",err);
      })
  });
  socket.on("gps:disponibles",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    cliente.idInterval = setInterval(()=>{
      socket.emit("gps:disponibles",{ubicaciones:cliente.cercanos})
    },3000);
  })
  socket.on("gps:stop",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    clearInterval(cliente.idInterval);
  })
}