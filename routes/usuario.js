const controlador = require('./../controllers/usuario');
const passport    = require('passport');

const rutas = function(router){
  //rutas de autenticacion
  router.post(    '/usuario'       , controlador.create);
  router.post(    '/usuario/login' , controlador.login);
  router.post(    '/usuario/token' , controlador.token);
  //rutas privadas
  router.get(     '/usuario/:id/logout',  passport.authenticate('jwt', {session:false}), controlador.logout);
  router.post(    '/usuarios',            passport.authenticate('jwt', {session:false}), controlador.getAll);
  router.put(     '/usuario/:id/estado',  passport.authenticate('jwt', {session:false}), controlador.cambiarEstado);
  router.put(     '/usuario/:id',         passport.authenticate('jwt', {session:false}), controlador.update);
  router.delete(  '/usuario',             passport.authenticate('jwt', {session:false}), controlador.remove);
}

//rutas publicas
const publicAPI = function(router){  
  router.get('/usuarios'    , controlador.prueba);
  router.get('/usuario/:id' , controlador.get);
}

module.exports.rutas = rutas;
module.exports.publicas = publicAPI;

