const Servidor = require('../socket').Servidor;

const rutas = function(router){
  router.get(  '/conectados' ,  (req, res)=>{
		console.log(Servidor.clientes);
		res.statusCode = 200;//send the appropriate status code
		res.json({status:"success", data:{}});
	});
}
module.exports = rutas;
