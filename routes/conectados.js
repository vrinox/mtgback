const Servidor = require('../socket/servidor');

const rutas = function(router){
  router.get(  '/conectados' ,  (req, res)=>{
    console.log(Servidor.clientes.map((cliente)=>{
			return cliente.ubicacion;
		}));
		let clientes = Servidor.clientes.map((cliente)=>{
			return {
					ubicacion	:	cliente.ubicacion,
					id			:	cliente.usuario.dataValues.id,
					nombre		:	cliente.usuario.dataValues.username,
					socket		:	cliente.socket.id
			};
		})
		res.statusCode = 200;//send the appropriate status code
		res.json({usuarios:clientes.length, clientes:clientes});
	});
}
module.exports = rutas;
