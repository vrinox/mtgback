const OneSignal = require('onesignal-node');
const Mensaje   = require('../models').Mensaje;

module.exports = async function(socket,server){
  socket.on("add-message",(data)=>{
    data.estado = 'S';
    let err,mensaje;
    [err, mensaje] = await to(Mensaje.create(data));
    if(err){
      socket.emit("msg:estado",{success:false,error:err})
    }else{
      data.id = mensaje.id;
      socket.emit("msg:estado",{success:true,mensaje:data);
      server
        .getCliente(data.receptor.id)
        .then((cliente)=>{
          if(cliente.emit){
            cliente.emit('add-message',data);
            console.log("SOCKET: mensaje enviado a "+cliente.usuario.username);
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
            push.setTargetDevices([data.receptor.deviceId]);

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
    }
  });
  //recibido
  socket.on("msg:recibido",async (msg)=>{
    let err,mensaje;
    [err, mensaje] = await to(Mensaje.findOne({where:{"id":msg.id}));
    if(!err){
      mensaje.estado = msg.estado;
      [err, mensaje] = await to(mensaje.save());
    }
    server
      .getCliente(msg.emisor.id)
      .then((cliente)=>{
        if(cliente.emit){
          cliente.emit('msg:estado',{success:true,mensaje:msg});
        }
      });
  });
}
