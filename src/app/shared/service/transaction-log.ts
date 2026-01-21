import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiResponseModel } from '../model/api-response-model';
import { environment } from '../../../environment/environment'
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionLogService {

  constructor(private _http: HttpClient) { }

  getTransactionLog(params?: any) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.trans}`, { params: httpParams }).pipe(map(o => o.result));
  }

  exportTrans() {
    return this._http.get<ApiResponseModel<null>>(`${environment.apis.trans}/export`).pipe(map(o => o.result));
  }
  
}
