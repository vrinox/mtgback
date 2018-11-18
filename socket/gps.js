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
  socket.on("gps:disponibles",(data)=>{
    let cliente = server.getCliente(data.usuarioId);
    console.log(cliente.cercanos);
    socket.emit("gps:disponibles",{ubicaciones:cliente.cercanos})
  })
}