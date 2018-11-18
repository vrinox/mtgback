import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map ,catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  public baseUrl: string = "https://api.scryfall.com";
  constructor(public http: HttpClient) { }

  public getByMultiverseId(CardMultiverseId): Observable<any> {
    return this.http
      .get(this.baseUrl + '/cards/multiverse/'+CardMultiverseId)
      .pipe(
        map((response:any) => {
          return response;
        }),
        catchError((error)=>{
          console.log(error);
          return Observable.throw(error);
        })
      )      
  }
}
