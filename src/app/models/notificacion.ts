import { Usuario } from './usuario';
export class Notificacion {
   id         : number;
   titulo     : string;
   contenido  : string;
   estado     : string;
   invitacion : any;
   anfitrion  : Usuario;
   createdAt  : Date;
   updatedAt  : Date;

   constructor(values: Object = {}) {
        Object.assign(this, values);
   }
   getValues(){
     return {
       id       : this.id       ,
       createdAt: this.createdAt,
       updatedAt: this.updatedAt,
     }
   }
}
