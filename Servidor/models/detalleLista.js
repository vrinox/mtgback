'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('DetalleLista', {
    cantidad  : DataTypes.SMALLINT,
    idCarta   : DataTypes.STRING,
    ListaId   : DataTypes.SMALLINT
  });

  Model.associate = function(models){
      this.belongsTo(models.Lista,{foreignKey:"ListaId",sourceKey:"id", as:"lista"});
      this.belongsTo(models.Carta,{foreignKey:"idCarta",sourceKey:"id", as:"carta"})
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
