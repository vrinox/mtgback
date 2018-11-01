const Ctrl = require('./../controllers/lista');
const detCtrl = require('./../controllers/detalleLista');
const passport   = require('passport');

const rutas = function(router){
  router.get(   '/listas'        , passport.authenticate('jwt', {session:false}), Ctrl.getAll);
  router.post(  '/lista'         , passport.authenticate('jwt', {session:false}), Ctrl.create);
  router.put(   '/lista/:idLista', passport.authenticate('jwt', {session:false}), Ctrl.update);
  router.delete('/lista/:idLista', passport.authenticate('jwt', {session:false}), Ctrl.remove);

  //rutas del detalle
  router.post(  '/lista/:idLista/carta'          , passport.authenticate('jwt', {session:false}), detCtrl.agregarCarta);
  router.put(   '/lista/:idLista/carta/:idCarta' , passport.authenticate('jwt', {session:false}), detCtrl.actualizarCarta);
  router.delete('/lista/:idLista/carta/:idCarta' , passport.authenticate('jwt', {session:false}), detCtrl.eliminarCarta);
}
//rutas publicas
const publicAPI = function(router){
  router.get('/lista/:idLista', Ctrl.get);
}

module.exports.rutas = rutas;
module.exports.publicas = publicAPI;
