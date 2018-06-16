module.exports = function(socket,server){
  socket.on("add-message",(data)=>{
    console.log(data);
    data.estado = 'S';
    socket.emit("msg:server",data);
  });
}
