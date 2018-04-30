const express 			    = require('express');
const router 			      = express.Router();


const passport      	  = require('passport');
const path              = require('path');
//rutas externas
require('./formato')(router);
require('./duelo')(router)
require('./usuario')(router);
require('./mazo')(router);
require('./carta')(router);

require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"MagicHub API", data:{"version_number":"v1.0.0"}})
});

// router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
