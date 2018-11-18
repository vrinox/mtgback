import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map ,catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Card } from "../models/card";
@Injectable({
  providedIn: 'root'
})

export class MtgService {
  public baseUrl: string = "https://mtgback.herokuapp.com/v1";
  constructor(public http: HttpClient) {

  }
  public getAll(filtros): Observable<Card[]> {
    return this.http
      .post(this.baseUrl + '/cartas',{filtros:filtros})
      .pipe(
        map((response: any) => {return response.cartas.map((carta) => new Card(carta))})
      )
      
  }

  public getById(CardId): Observable<Card> {
    return this.http
      .get(this.baseUrl + '/carta/'+CardId)
      .pipe(
        map((response:any) => {
          return new Card(response.mazo);
        }),
        catchError((error)=>{
          console.log(error);
          return Observable.throw(error);
        })
      )      
  }

  public search(terms: Observable<string>){
    return terms
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.searchEntries(term))
      )
  }

  public searchEntries(nombre:string){
    if(nombre!=""){
      return this.http
        .post(this.baseUrl + '/cartas',{filtros:{name:nombre}})
        .pipe(
          map((response: any) => {
            return response.cartas.map((carta) => new Card(carta));
          })
        )
    }else{
      return [];
    }
  }

}
