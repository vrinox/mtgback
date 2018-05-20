const custom = function(req, res, next){
  let body = req.body;
  for(let propiedad in body){
    if (body.hasOwnProperty(propiedad)) {
      if(typeof body[propiedad] == "string"){
        body[propiedad] = body[propiedad].toLowerCase();
      }
    }
  }
  if(CONFIG.log_body == 1){
    console.log("-------------------");
    console.log("Body:",body);
    console.log("-------------------");
  }
  next();
}
module.exports = custom;
