'use strict';
 
  class Cliente{
    constructor(datos){
      this.socket = datos.socket;
      this.usuario  = datos.usuario;
      this.ubicacion = null;
      this.estado   = false;
      this.idInterval = datos.idInterval;
      this.idIntervalOponente = datos.idIntervalOponente;
    }
    
    cerrarIntervalos(){
      if(this.idInterval){clearInterval(this.idInterval)}
      if(this.idIntervalOponente){clearInterval(this.idIntervalOponente)}
      this.ubicacion = null;
    }
    
  } 

  module.exports = Cliente;
