const controlador = require('./../controllers/notificacion');
const passport    = require('passport');
const rutas = function(router){
  //rutas notificacion
  router.get('/notificaciones',  passport.authenticate('jwt', {session:false}), controlador.getAll);
  //rutas invitacion
  router.get('/invitacion/:id/aceptar'  ,  passport.authenticate('jwt', {session:false}), controlador.aceptar);
  router.get('/invitacion/:id/rechazar' ,  passport.authenticate('jwt', {session:false}), controlador.rechazar);

}

module.exports = rutas;
