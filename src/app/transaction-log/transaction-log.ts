import { Component, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from '../shared/service/loading';
import { TransactionLogService } from '../shared/service/transaction-log';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-transaction-log',
  imports: [ TableModule, CommonModule, ButtonModule ],
  templateUrl: './transaction-log.html',
  styleUrl: './transaction-log.scss',
})
export class TransactionLog {

  public transLog: any[] = [];
  public totalRecords: number = 0;
  public rows: number = 10;

  constructor(
    private loadingService: LoadingService,
    private transService: TransactionLogService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
  }

  initaData(params: any) {
    // this.loadingService.start();
    this.transService.getTransactionLog(params).subscribe({
      next: (response: any) => {
        this.transLog = response?.data ?? [];
        this.totalRecords = response?.total_data ?? 0;
        // this.loadingService.stop();
        this._cdr.detectChanges();
      },
      error: () => {
        this.loadingService.stop();
      }
    })
  }

  onLazyLoad(event: any) {
    let page: number = event.first / event.rows;
    page = page + 1;
    this.rows = event.rows;
    const params = {limit: event.rows, page: page};
    this._cdr.detectChanges();
    this.initaData(params)
  }
 
  onExport() {
    // this.loadingService.start();
    this.transService.exportTrans().subscribe({
      next: (response: any) => {
        const dataFile = response;
        const fileName = dataFile.export_name;
        const byteArray = new Uint8Array(
          atob(dataFile.base64_file)
          .split('')
          .map((char: any) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], {
          type: 'application/octet-stream',
        });
        saveAs(blob, `${fileName}`);
        // this.loadingService.stop();
      }, error: (err) => {
        // this.alertService.alert('error', '', err?.error?.message)
        // this.loadingService.stop();
      }
    })
  }
}
