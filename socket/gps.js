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
    cliente.idIntervalOponente = setInterval(async ()=>{
      let jugador = await server.getCliente(data.usuarioId); 
      if(jugador && jugador.estado == true){
        socket.emit("gps:oponente",{ubicacion:jugador.ubicacion})
      }else{
        socket.emit("gps:oponente",{ubicacion:null})
      }
    },5000);
  });
  socket.on("gps:oponente:stop",async (data)=>{
    let cliente = await server.getClienteById(socket.id);
    clearInterval(cliente.idIntervalOponente);
  });
}