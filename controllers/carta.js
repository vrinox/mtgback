const mtg = require('mtgsdk');

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, cartas, filtros;
    filtros = req.body.filtros;
    //ordeno por orden alfabetico en caso de que no traiga un orden
    if(!filtros.hasOwnProperty("orderBy")){
      filtros.orderBy="name";
    }
    /*
      para paginacion usa:
        page    : pagina actual,
        pageSize: registros por pagina
    */
   console.log("[Cartas]",filtros);
    [err, cartas] = await to(mtg.card.where(filtros));
    if(err) ReE(res, {success:false, error:err}, 422);
    return ReS(res, {"cartas":cartas});
}

module.exports.getAll = getAll;

const getAllCards = async function(req, res){
  res.setHeader('Content-Type', 'application/json');
  let err, cartas, filtros;
  filtros = req.body.filtros;
  //ordeno por orden alfabetico en caso de que no traiga un orden
  if(!filtros.hasOwnProperty("orderBy")){
    filtros.orderBy="name";
  }
  getPaginado(filtros).then((todas)=>{
    console.log(todas.map((card)=>{return card.name}))
  })
  return ReS(res, {"cartas":"todas"});
}

module.exports.getAllCards = getAllCards;

const getPaginado = async function(filtros){
  let todas = [];
  return new Promise((resolve,reject)=>{    
    mtg.card.all(filtros).on("data",(data)=>{
      console.log("[CartasAll]:data",data.name);
      todas.push(data);
    })
    mtg.card.all(filtros).on("end",(data)=>{
      resolve(todas);
    })
  })
}

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idCarta,carta;
    idCarta = req.params.id;
    [err, carta] = await to(mtg.card.find(idCarta));
    if(err) return ReE(res, {success:false, error:err}, 422);

    return ReS(res, {"carta":carta});
}
module.exports.get = get;
