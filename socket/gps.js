
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
  socket.on("gps:disponibles",(usuarioId)=>{
    console.log("GPS:disponibles "+usuarioId);
    server
      .getCliente(usuarioId)
      .then((cliente)=>{
        console.log("GPS:",cliente.ultimaUbicacion);
      })
  })
}