const controlador = require('./../controllers/notificacion');
const passport    = require('passport');
const rutas = function(router){
  //rutas privadas
  router.get('/notificaciones/:id',  passport.authenticate('jwt', {session:false}), controlador.getAll);
}

module.exports = rutas;
