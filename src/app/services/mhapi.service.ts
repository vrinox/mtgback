import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map ,catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from "../models/usuario";
@Injectable({
  providedIn: 'root'
})
export class MhapiService {
  public baseUrl: string = "https://mtgback.herokuapp.com/p";
  constructor(public http: HttpClient) { }

  public buscarUsuario(terms: Observable<string>){
    return terms.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    )
  }

  public searchEntries(username:string){
    return this.http
      .post(this.baseUrl+"/usuarios",{filtros:{
        "username":username,
        "nombre"  :username,
        "apellido":username
      }})
      .pipe(
        map((response: any) => {
          if(response.success){
              return response.usuarios.map((usuario)=>{return new Usuario(usuario);});
          }else{
            console.log(response);
            return [];
          }
        })
      )
  }
  public buscarDetalleUsuario(usuario:Usuario){
    return this.http
      .get(this.baseUrl+"/usuario/"+usuario.id)
      .pipe(
        map((response: any) => {
          if(response.success){
              return new Usuario(response.usuario);
          }else{
            console.log(response);
            return [];
          }
        })
      )
  }
}