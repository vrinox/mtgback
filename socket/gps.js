
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
    console.log("GPS:disponibles "+data.usuarioId);
    server
      .getCliente(data.usuarioId)
      .then((cliente)=>{
        console.log("GPS:",cliente.ultimaUbicacion);
      })
  })
}