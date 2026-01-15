import { Routes } from '@angular/router';
import { Product } from './product/product'

export const routes: Routes = [
    { path: '', redirectTo: 'product', pathMatch: 'full' },
    { path: 'product', component: Product },
];
