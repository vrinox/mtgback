const Ctrl = require('./../controllers/lista');
const detCtrl = require('./../controllers/detalleLista');
const passport   = require('passport');

const rutas = function(router){
  router.get(   '/listas'        , passport.authenticate('jwt', {session:false}), Ctrl.getAll);
  router.get(   '/lista/:idlista', passport.authenticate('jwt', {session:false}), Ctrl.get);
  router.post(  '/lista'         , passport.authenticate('jwt', {session:false}), Ctrl.create);
  router.put(   '/lista/:idlista', passport.authenticate('jwt', {session:false}), Ctrl.update);
  router.delete('/lista/:idlista', passport.authenticate('jwt', {session:false}), Ctrl.remove);

  //rutas del detalle

  router.post(  '/lista/:idlista/carta'          , passport.authenticate('jwt', {session:false}), detCtrl.agregarCarta);
  router.put(   '/lista/:idlista/carta/:idCarta' , passport.authenticate('jwt', {session:false}), detCtrl.actualizarCarta);
  router.delete('/lista/:idlista/carta/:idCarta' , passport.authenticate('jwt', {session:false}), detCtrl.eliminarCarta);

}

module.exports = rutas;
