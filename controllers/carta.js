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
  let filtrosAll = Object.assign({},filtros);
  delete filtrosAll.page;
  delete filtrosAll.pageSize;
  console.log("[Cartas]",filtros,filtrosAll);
  let todas = [];
  mtg.card.all(filtrosAll)
  .on("data",(data)=>{
    console.log("[CartasAll]:data",data);
    todas.push(data);
  })
  mtg.card.all(filtrosAll)
  .on("end",(data)=>{
    console.log("[CartasAll]:data",todas.map((carta)=>{
      num++;
      return {n:carta.name,"º":num};
    }));
  })
  let num = 0;
  mtg.card.where(filtros).then((cartas)=>{
    console.log("[CartasAll]:where",cartas.map((carta)=>{
      num++;
      return {n:carta.name,"º":num};
    }))
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
