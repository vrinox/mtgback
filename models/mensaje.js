'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Mensaje', {
    contenido: DataTypes.STRING,
  });

  Model.associate = function(models){
      this.belongsTo(models.Chat);
      this.belongsTo(models.Usuario);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
