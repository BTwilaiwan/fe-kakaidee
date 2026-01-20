import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiResponseModel } from '../model/api-response-model';
import { environment } from '../../../environment/environment'
import { map, Observable } from 'rxjs';

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


  getProduct(params?: any) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.product}`, { params: httpParams }).pipe(map(o => o.result));
  }

  getDdlCategory() {
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.basic}/category`).pipe(map(o => o.result));
  }

  getDdlLot() {
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.prdStock}/search/lot`).pipe(map(o => o.result));
  }
  
  getDdlWarehouse() {
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.prdStock}/search/warehouse`).pipe(map(o => o.result));
  }

  exportExcel() {
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.product}/export`).pipe(map(o => o.result));
  }

  importExcel(uploadFile: any) {
    const formData = new FormData();
    formData.append('file', uploadFile)
    return this._http.post<ApiResponseModel<null>>(`${environment.apis.product}/import/excel`, formData, httpOptions)
  }
}
