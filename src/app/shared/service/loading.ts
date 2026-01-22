import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  private loadingCount = 0;

  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 
  isLoading$ = this._isLoading$.asObservable();
  // get isLoading$(): Observable<boolean> {
  //   return this._isLoading$.asObservable();
  // }
 
  public start(): void {
    this.loadingCount++;
    this._isLoading$.next(true);
  }
 
  public stop(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this._isLoading$.next(false);
    }
  }
}