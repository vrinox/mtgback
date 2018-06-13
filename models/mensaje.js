'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Mensaje', {
    contenido : DataTypes.STRING,
    idEmisor  : DataTypes.INTEGER,
    idReceptor: DataTypes.INTEGER,
    estado    : DataTypes.STRING //Pendendiente, Servidor, Recivido, Leido
  });

  Model.associate = function(models){
      this.belongsTo(models.Chat);
      this.belongsTo(models.Usuario,{ foreignKey:"idReceptor" ,sourceKey:"id" });
      this.belongsTo(models.Usuario,{ foreignKey:"idEmisor"   ,sourceKey:"id" });
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
