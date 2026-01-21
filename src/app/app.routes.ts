import { Routes } from '@angular/router';
import { Product } from './product/product'
import { TransactionLog } from './transaction-log/transaction-log'

export const routes: Routes = [
    { path: '', redirectTo: 'product', pathMatch: 'full' },
    { path: 'product', component: Product },
    { path: 'transaction', component: TransactionLog },
];
