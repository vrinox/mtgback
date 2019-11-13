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
  /*
    para paginacion usa:
      page    : pagina actual,
      pageSize: registros por pagina
  */
 console.log("[Cartas]",filtros);
  let todas = [];
  mtg.card.all(filtros)
  .on("data",(data)=>{
    console.log("[CartasAll]:data",data);
    cartas.push(data);
  })
  mtg.card.all(filtros)
  .on("end",(data)=>{    
    console.log("[CartasAll]:All",data,todas)
  })
  return ReS(res, {"mensaje":"arranco"});
}

module.exports.getAllCards = getAllCards;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idCarta,carta;
    idCarta = req.params.id;
    [err, carta] = await to(mtg.card.find(idCarta));
    if(err) return ReE(res, {success:false, error:err}, 422);

    return ReS(res, {"carta":carta});
}
module.exports.get = get;
