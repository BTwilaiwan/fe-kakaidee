import { Component } from '@angular/core';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { LoadingService } from '../../service/loading';

@Component({
  selector: 'app-spinner',
  imports: [ BlockUIModule, ProgressSpinnerModule ],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {

  public loading: boolean = false;

  constructor(
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.isLoading$.subscribe(resLoad => {
      this.loading = resLoad
    })
  }

}
