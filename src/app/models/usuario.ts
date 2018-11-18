import { Deck } from "./deck";
import { Lista } from "./lista";

export class Usuario {
   id       : number;
   username : string;
   nombre   : string;
   apellido : string;
   email    : string;
   estado   : boolean;
   status   : string;
   imagesrc : string;
   telefono : string;
   avatarImg: string;
   deviceId : string;
   mazos    : Deck[];
   listas   : Lista[];
   constructor(values: Object = {}) {
        Object.assign(this, values);
        this.inicializar();
   }
  inicializar(){
    this.status   = (this.estado)?"activo":"inactivo";
    this.avatarImg = (this.avatarImg)?this.avatarImg:"assets/imgs/placeholder.png";
    if(this.mazos){
      this.mazos = this.mazos.map(
        (mazo:any)=>{
          return new Deck(mazo);
        });
    }else{
       this.mazos = [];
    }
    if(this.listas){
      this.listas = this.listas.map(
        (lista:any)=>{
          return new Lista(lista);
        });
    }else{
      this.listas = [];
    }
  }
  getValues(){
    let value ={
      id       : this.id       ,
      username : this.username ,
      nombre   : this.nombre   ,
      apellido : this.apellido ,
      email    : this.email    ,
      estado   : this.estado   ,
      status   : this.status   ,
      imagesrc : this.imagesrc ,
      telefono : this.telefono ,
      avatarImg: this.avatarImg,
      mazos    : [],
      listas   : []
    }
    if(this.mazos){
      value.mazos = this.mazos.map((mazo:Deck)=>{
        return mazo.getValues();
      });
    }
    if(this.listas){
      value.listas = this.listas.map((lista:Lista)=>{
        return lista.getValues();
      });
    }
    return value;
  }

}
