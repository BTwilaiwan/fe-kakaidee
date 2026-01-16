import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-log',
  imports: [ TableModule, CommonModule ],
  templateUrl: './transaction-log.html',
  styleUrl: './transaction-log.scss',
})
export class TransactionLog {

  public products: any[] = [];

  constructor() {}

}
