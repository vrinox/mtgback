'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Liga', {
    nombre    : DataTypes.STRING,
    iconclass : DataTypes.STRING,
    tipo      : DataTypes.STRING,
    win_req   : DataTypes.SMALLINT,  //cantidad minima de duelos ganados para llegar a esta liga
    avg_req   : DataTypes.DOUBLE,   //average de duelos ganados vs perdidos para mantenerce en la liga
    orden     : DataTypes.SMALLINT   //orden en el que muestran
  });

  Model.associate = function(models){
    this.belongsTo(models.Formato);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};
