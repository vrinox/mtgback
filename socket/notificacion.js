module.exports = function(socket){
  socket.on("notificacion",(data)=>{
    console.log(data);
  });
}
