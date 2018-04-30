const mtg = require('mtgsdk');

const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, cartas, filtros, page;
    filtros = req.body.filtros;
    console.log(filtros);
    /*
      para paginacion usa:
        page    : pagina actual,
        pageSize: registros por pagina
    */
    [err, cartas] = await to(mtg.cards.all(filtros));
    if(err) ReE(res, err, 422);
    return ReS(res, {"cartas":cartas});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let idCarta,carta;
    idCarta = req.params.id;
    [err, carta] = await to(mtg.find(idCarta);
    if(err) return ReE(res, err, 422);

    return ReS(res, {"carta":carta});
}
module.exports.get = get;
