export class Formato {
   id       : number;
   nombre   : string;
   iconclass: string;
   createdAt: string;
   updatedAt: string;

   constructor(values: Object = {}) {
        Object.assign(this, values);
   }
   getValues(){
     return {
       id       : this.id       ,
       nombre   : this.nombre   ,
       iconclass: this.iconclass,
       createdAt: this.createdAt,
       updatedAt: this.updatedAt,
     }
   }
}
