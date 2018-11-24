const controlador = require('./../controllers/amigo');
const passport    = require('passport');
const rutas = function(router){
  router.get('/amigos'            , passport.authenticate('jwt', {session:false}),controlador.getAll);
  router.post('/amigo/:id/invitar', passport.authenticate('jwt', {session:false}),controlador.crearInvitacion);
  //rutas invitacion
  router.get('/invitacion/:id/aceptar'  ,  passport.authenticate('jwt', {session:false}), controlador.aceptar);
  router.get('/invitacion/:id/rechazar' ,  passport.authenticate('jwt', {session:false}), controlador.rechazar);
}
module.exports = rutas;
