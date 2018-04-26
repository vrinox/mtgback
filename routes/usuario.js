const userParser        = require('./../middleware/userParser');
const UsuarioController 	  = require('./../controllers/usuario');
const passport      	  = require('passport');

const rutas = function(router){
  //router.delete(    '/duelo', userParser.usuario, userParser.retador, DueloController.remove);
  router.post(    '/usuario',         UsuarioController.create);                                                    // C
  router.get(     '/usuario/:id',     passport.authenticate('jwt', {session:false}), UsuarioController.get);
  router.get(     '/usuario',         passport.authenticate('jwt', {session:false}), UsuarioController.get);
  router.put(     '/usuario',         passport.authenticate('jwt', {session:false}), UsuarioController.update);     // U
  router.delete(  '/usuario',         passport.authenticate('jwt', {session:false}), UsuarioController.remove);     // D
  router.post(    '/usuario/login',   UsuarioController.login);
}

module.exports = rutas;
