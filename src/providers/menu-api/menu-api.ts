import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the MenuApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MenuApiProvider {


  constructor(private http: HttpClient) { }

  /**
   * Get the locat menu from a json file in asset/data folder
   */
  getLocalMenu() : Observable<any> {
    return this.http.get("./assets/data/menu.json")
  }

}
