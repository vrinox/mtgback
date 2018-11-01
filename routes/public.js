const express= require('express');
const router = express.Router();

const public = function(){
  //poseen varidad de rutas
  require('./usuario').publicas(router);
  require('./mazo').publicas(router);
  require('./lista').publicas(router);
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.json({status:"success", message:"MagicHub API public routes", data:{"version_number":"v1.0.0"}})
  });
  return router;
}
module.exports = p;
