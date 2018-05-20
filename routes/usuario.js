const controlador = require('./../controllers/usuario');
const passport    = require('passport');
const multer      = require('../services/multer');

const rutas = function(router){
  //rutas de autenticacion
  router.post(    '/usuario',       controlador.create);                                                    // C
  router.post(    '/usuario/login', controlador.login);
  router.post(    '/usuario/token', controlador.token);
  //rutas privadas
  router.get(     '/usuario/:id',         passport.authenticate('jwt', {session:false}), controlador.get);
  router.post(    '/usuario/:id/avatar',  passport.authenticate('jwt', {session:false}), multer.single('file')  ,controlador.subirAvatar);
  router.put(     '/usuario/:id/estado',  passport.authenticate('jwt', {session:false}), controlador.cambiarEstado);
  router.put(     '/usuario/:id',         passport.authenticate('jwt', {session:false}), controlador.update);     // U
  router.delete(  '/usuario',             passport.authenticate('jwt', {session:false}), controlador.remove);     // D
}

module.exports = rutas;
