const Servidor = require('../socket').Servidor;

const rutas = function(router){
  router.get(  '/conectados' ,  (req, res)=>{
    console.log(Servidor.clientes.ultimaUbicacion);
		let clientes = Servidor.clientes.map((cliente)=>{
			return {
					id				: cliente.usuario.dataValues.id,
					nombre		: cliente.usuario.dataValues.username,
					ubicacion	:	cliente.ultimaUbicacion,
					socket		:	cliente.id
			};
		})
		res.statusCode = 200;//send the appropriate status code
		res.json({usuarios:clientes.length, clientes:clientes});
	});
}
module.exports = rutas;
