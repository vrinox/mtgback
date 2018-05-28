const controlador = require('./../controllers/amigo');
const rutas = function(router){
  router.get('/amigos/:id', controlador.getAll);
}
module.exports = rutas;
