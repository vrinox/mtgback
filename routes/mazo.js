const Ctrl = require('./../controllers/mazo');
const detCtrl = require('./../controllers/detalleMazo');
const passport   = require('passport');

const rutas = function(router){
  router.get(   '/mazos'                , passport.authenticate('jwt', {session:false}), Ctrl.getAll);
  router.get(   '/mazo/:idMazo'         , passport.authenticate('jwt', {session:false}), Ctrl.get);
  router.post(  '/mazo'                 , passport.authenticate('jwt', {session:false}), Ctrl.create);
  router.post(  '/mazo/:idMazo/duplicar', passport.authenticate('jwt', {session:false}), Ctrl.duplicar);
  router.put(   '/mazo/:idMazo'         , passport.authenticate('jwt', {session:false}), Ctrl.update);
  router.delete('/mazo/:idMazo'         , passport.authenticate('jwt', {session:false}), Ctrl.remove);

  //rutas del detalle

  router.post(  '/mazo/:idMazo/carta'          , passport.authenticate('jwt', {session:false}), detCtrl.agregarCarta);
  router.put(   '/mazo/:idMazo/carta/:idCarta' , passport.authenticate('jwt', {session:false}), detCtrl.actualizarCarta);
  router.delete('/mazo/:idMazo/carta/:idCarta' , passport.authenticate('jwt', {session:false}), detCtrl.eliminarCarta);

}

module.exports = rutas;
