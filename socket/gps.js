
module.exports = async function(socket,server){
    socket.on("gps",(data)=>{
        console.log(data);
        server
            .getCliente(data.usuario)
            .then((cliente)=>{
                cliente.ultimaUbicacion = data.latlng;
            })
            .catch((err)=>{
                console.log("GPS:",err);
            })
    });
}