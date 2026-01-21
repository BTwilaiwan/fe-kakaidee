import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-transaction-log',
  imports: [ TableModule, CommonModule, ButtonModule ],
  templateUrl: './transaction-log.html',
  styleUrl: './transaction-log.scss',
})
export class TransactionLog {

  public products: any[] = [];

  constructor() {}

}
