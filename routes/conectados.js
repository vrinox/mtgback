const Servidor = require('../socket').Servidor;
const rutas = function(router){
  router.get(  '/conectados' ,  (req, res))=>{
		res.statusCode = 200;//send the appropriate status code
		res.json({status:"success", data:Servidor.clientes});
	});
}
