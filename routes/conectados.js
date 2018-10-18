const Servidor = require('../socket').Servidor;

const rutas = function(router){
  router.get(  '/conectados' ,  (req, res)=>{
		let clientes = Servidor.clientes.map((cliente)=>{
			return {
				Socket:{
					id:cliente.id
				},
				usuario: cliente.usuario.dataValues
			};
		})
		res.statusCode = 200;//send the appropriate status code
		res.json({status:"success", data:clientes});
	});
}
module.exports = rutas;
