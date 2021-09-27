import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PriceapiService {

  constructor(private http: HttpClient) { }
  configUrl = 'https://api.pancakeswap.info/api/v2/tokens/0x5de6d63d1bfdadd8597abbbb261b276613a1fd31';

  getApolloPrice() {
    return this.http.get<any>(this.configUrl);
  }
  getBNBPrice() {
    return this.http.get<any>('https://api.pancakeswap.info/api/v2/tokens/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c');
  }
  getSafeEarnPrice(){
    return this.http.get<any>('https://api.pancakeswap.info/api/v2/tokens/0x099f551ea3cb85707cac6ac507cbc36c96ec64ff');
  }
}
