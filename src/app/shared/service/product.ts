import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponseModel } from '../model/api-response-model';
import { environment } from '../../../environment/environment'
import { map } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private _http: HttpClient) { }
  
  createProduct(data: any) {
    let body = JSON.stringify(data);
    return this._http.post<ApiResponseModel<null>>(`${environment.apis.product}/create`, body, httpOptions);
  }


  getProduct() {
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.product}`).pipe(map(o => o.result));
  }
}
