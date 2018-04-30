const mtg = require('mtgsdk');

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, cartas, filtros;
    filtros = req.body.filtros;

    /*
      para paginacion usa:
        page    : pagina actual,
        pageSize: registros por pagina
    */
    [err, cartas] = await to(mtg.card.where(filtros));
    if(err) ReE(res, err, 422);
    return ReS(res, {"cartas":cartas});
}

mudule.exports.getAll = getAll;

const getPorNombre = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, cartas, filtros;
    filtros = {"name":"'"+req.params.nombre+"'"};

    [err, cartas] = await to(mtg.card.where(filtros));
    if(err) ReE(res, err, 422);
    return ReS(res, {"cartaa":carta});
}
module.exports.getPorNombre = getPorNombre;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idCarta,carta;
    idCarta = req.params.id;
    [err, carta] = await to(mtg.card.find(idCarta));
    if(err) return ReE(res, err, 422);

    return ReS(res, {"carta":carta});
}
module.exports.get = get;
