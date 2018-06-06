const express 			    = require('express');
const router 			      = express.Router();
const path              = require('path');
const passport    = require('passport');

const v1 = function(){
  require('./../middleware/passport')(passport)
  //rutas externas
  require('./amigo')(router);
  require('./formato')(router);
  require('./duelo')(router)
  require('./usuario')(router);
  require('./mazo')(router);
  require('./carta')(router);
  require('./notificacion')(router);
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.json({status:"success", message:"MagicHub API", data:{"version_number":"v1.0.0"}})
  });
  //********* API DOCUMENTATION **********
  router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
  router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));

  return router;
}
module.exports = v1;
