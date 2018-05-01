const Controller = require('./../controllers/mazo');
const passport   = require('passport');

const rutas = function(router){
  router.get(   '/mazos'        , passport.authenticate('jwt', {session:false}), Controller.getAll);
  router.get(   '/mazo/:idMazo' , passport.authenticate('jwt', {session:false}), Controller.get);
  router.post(  '/mazo'         , passport.authenticate('jwt', {session:false}), Controller.create);
  router.put(   '/mazo/:idMazo' , passport.authenticate('jwt', {session:false}), Controller.update);
  router.delete('/mazo/:idMazo' , passport.authenticate('jwt', {session:false}), Controller.remove);

  //rutas del detalle

  router.post(  '/mazo/:idMazo/carta'          , passport.authenticate('jwt', {session:false}), Controller.agregarCarta);
  router.put(   '/mazo/:idMazo/carta/:idCarta' , passport.authenticate('jwt', {session:false}), Controller.actualizarCarta);
  router.delete('/mazo/:idMazo/carta/:idCarta' , passport.authenticate('jwt', {session:false}), Controller.eliminarCarta);

}

module.exports = rutas;
