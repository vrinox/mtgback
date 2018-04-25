const userParser        = require('./../middleware/userParser');
const UsuarioController 	  = require('./../controllers/usuario');

const rutas = function(router){
  //router.delete(    '/duelo', userParser.usuario, userParser.retador, DueloController.remove);
  router.post(    '/usuario',          UserController.create);                                                    // C
  router.get(     '/usuario',          userParser.usuario, UserController.get);
  // router.put(     '/users',           passport.authenticate('jwt', {session:false}), UserController.update);     // U
  // router.delete(  '/users',           passport.authenticate('jwt', {session:false}), UserController.remove);     // D
  // router.post(    '/users/login',     UserController.login);

}

module.exports = rutas;
