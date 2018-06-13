module.exports = function(socket){
  socket.on("add-message",(data)=>{
    console.log(data);
  });
}
