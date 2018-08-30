'use strict';
module.exports = (sequelize, DataTypes) => {
  var Op = sequelize.Op;
  var Model = sequelize.define('Chat', {
    tipo        : DataTypes.STRING, //existen 3 tipos de chat 'B' = battleChat, "M" = mensajeChat, "T"=tradeChat
    idUsuario1  : DataTypes.INTEGER,
    idUsuario2  : DataTypes.INTEGER
  });

  Model.associate = function(models){
      this.belongsTo(models.Usuario, {as: "usuario1",foreignKey:"idUsuario1", sourceKey:"id"});
      this.belongsTo(models.Usuario, {as: "usuario2",foreignKey:"idUsuario2", sourceKey:"id"});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };
  Model.prototype.findForType = async function(receptorId,tipo){
    let [error,resultado] = await to(this.findAll({
      where:{
        [Op.or]: [{"idUsuario1": receptorId}, {"idUsuario2": receptorId}],
        [Op.and]: ["tipo":tipo]
      }
    }))
    return [error,resultado];
  }
  return Model;
};
