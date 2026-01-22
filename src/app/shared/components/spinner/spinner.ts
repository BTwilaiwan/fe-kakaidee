import { Component, ChangeDetectorRef } from '@angular/core';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { LoadingService } from '../../service/loading';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [BlockUIModule, ProgressSpinnerModule, AsyncPipe],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {

  public loading: boolean = false;

  constructor(
    public loadingService: LoadingService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.loadingService.isLoading$.subscribe(resLoad => {
    //   this.loading = resLoad;
    //   console.log(this.loading)
    // })
  }

}
