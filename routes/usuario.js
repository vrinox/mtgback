const UsuarioController 	  = require('./../controllers/usuario');
const passport      	  = require('passport');

const rutas = function(router){
  //rutas de autenticacion
  router.post(    '/usuario',       UsuarioController.create);                                                    // C
  router.post(    '/usuario/login', UsuarioController.login);
  router.post(    '/usuario/token', UsuarioController.token);
  //rutas privadas
  router.get(     '/usuario/:id',         passport.authenticate('jwt', {session:false}), UsuarioController.get);
  router.get(     '/usuario',             passport.authenticate('jwt', {session:false}), UsuarioController.get);
  router.post(    '/usuario/:id/avatar',  passport.authenticate('jwt', {session:false}), UsuarioController.subirAvatar);
  router.put(     '/usuario/:id/estado',  passport.authenticate('jwt', {session:false}), UsuarioController.cambiarEstado);
  router.put(     '/usuario/:id',         passport.authenticate('jwt', {session:false}), UsuarioController.update);     // U
  router.delete(  '/usuario',             passport.authenticate('jwt', {session:false}), UsuarioController.remove);     // D
}

module.exports = rutas;
