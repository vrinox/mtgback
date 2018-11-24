const controlador = require('./../controllers/notificacion');
const passport    = require('passport');
const rutas = function(router){
  //rutas notificacion
  router.get('/notificaciones',  passport.authenticate('jwt', {session:false}), controlador.getAll);
}

module.exports = rutas;
