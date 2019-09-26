module.exports = async function(socket,server){
  socket.on("gps",(data)=>{
    server
      .getCliente(data.usuario)
      .then(async (cliente)=>{
        cliente.estado = true;
        cliente.ubicacion = data.latLng;
        await server.buscarCercanos(cliente);
      })
      .catch((err)=>{
        console.log("GPS:",err);
      })
  });
  
  socket.on("gps:stop",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    cliente.estado = false;
    server.update(cliente);    
  });
  //---------------------- manejo de disponibles para duelos -----------------------------
  socket.on("gps:disponibles",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    cliente.idInterval = setInterval(async ()=>{
      let jugador = await server.getCliente(data.usuarioId);
      socket.emit("gps:disponibles",{ubicaciones:jugador.cercanos})
    },3000);
  });
  socket.on("gps:disponibles:stop",async (data)=>{
    let cliente = await server.getCliente(data.usuarioId);
    clearInterval(cliente.idInterval);
  });
  //-------------------- manejo de oponente por battle chat -------------------------------
  socket.on("gps:oponente:start",async (data)=>{
    let cliente = await server.getClienteById(socket.id);    
    console.log("[Gps:Duelo:solicitud]: usuario "+cliente.usuario.username+" esta solicitando data")
    cliente.idIntervalOponente = setInterval(async ()=>{
      let jugador = await server.getCliente(data.usuarioId);      
      console.log("[Gps:Duelo:envio]: usuario "+jugador.usuario.username+" data enviada")
      socket.emit("gps:oponente",{ubicacion:jugador.ubicacion})
    },3000);
  });
  socket.on("gps:oponente:stop",async (data)=>{
    let cliente = await server.getClienteById(socket.id);
    clearInterval(cliente.idIntervalOponente);
  });
}