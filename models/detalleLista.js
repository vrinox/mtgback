'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('DetalleLista', {
    cantidad  : DataTypes.SMALLINT,
    idCarta   : DataTypes.STRING
  });

  Model.associate = function(models){
      this.belongsTo(models.Lista);
      this.belongsTo(models.Carta,{foreignKey:"idCarta",sourceKey:"id", as:"carta"})
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
