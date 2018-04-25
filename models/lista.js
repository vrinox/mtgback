'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Lista', {
    /*
      Existen 3 tipos de lista
      'T' = lista de cambio o tradeList
      "M" = mensajeChat,
      "T" = tradeChat
    */
      tipo: DataTypes.STRING
  });

  Model.associate = function(models){
      this.belongsTo(models.Usuario);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
