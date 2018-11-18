'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Amigo', {
    idAmigo:DataTypes.INTEGER
  });

  Model.associate = function(models){
    this.belongsTo(models.Usuario,{foreignKey:"idAmigo",sourceKey:"id"});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
