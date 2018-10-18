const Servidor = require('../socket').Servidor;

const rutas = function(router){
  router.get(  '/conectados' ,  (req, res)=>{
		let clientes = JSON.stringify(Servidor.clientes);
		console.log(clientes);
		res.statusCode = 200;//send the appropriate status code
		res.json({status:"success", data:clientes});
	});
}
module.exports = rutas;
