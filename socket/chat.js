module.exports = function(socket){
  socket.on("add-message",(data)=>{
    console.dir(data);
  });
}
