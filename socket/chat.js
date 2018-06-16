const OneSignal = require('onesignal-node');

module.exports = function(socket,server){
  socket.on("add-message",(data)=>{
    console.log(data);
    data.estado = 'S';
    socket.emit("msg:server",data);
    server
      .getCliente(data.receptor.id)
      .then((cliente)=>{
        if(cliente.socket){
          cliente.socket.emit('add-message',data);
        }else{
          let texto;
          if(data.contenido.lenght > 20){
            texto = data.contenido.substr(0,16)+' ...';
          }else{
            texto = data.contenido;
          }
          let oneSignal = server.onesignal;
          var push = new OneSignal.Notification({
            "contents": {
                "en" : texto,
                "es" : texto
            }
          });
          push.setTargetDevices([receptor.deviceId]);

          push.setParameter("headings",{
            "en" : data.emisor.username+' te ha enviado un mensaje',
            "es" : data.emisor.username+' te ha enviado un mensaje'
          });
          push.setParameter("data", data);
          push.setParameter("large_icon",data.emisor.imagesrc);
          push.setParameter("android_group",oneSignal.groupKeys.MENSAJE);
          push.setParameter("android_group_message", "Mensajes nuevos");

          oneSignal.client.sendNotification(push)
            .then((response)=>{
              console.log("ONESIGNAL: mensaje enviado",response.data, response.httpResponse.statusCode)
            })
            .catch((err)=>{console.log("error enviando push",err)});
        }
      });
  });
}
