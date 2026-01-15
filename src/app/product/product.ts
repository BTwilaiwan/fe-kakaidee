import { Component, ChangeDetectorRef } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AddProduct } from './add-product/add-product';
import { AlertService } from '../shared/service/alert';
import { ProductService } from '../shared/service/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ CommonModule, AccordionModule, InputTextModule, SelectModule, ButtonModule, TableModule, AddProduct ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {

  public categoryList: any[] = [];
  public lotList: any[] = [];
  public statusList: any[] = [];
  public products: any[] = [];
  public isShowAddProduct: boolean = false;
  public titleHeader: string = '';
 
  constructor(
    private alertService: AlertService,
    private productService: ProductService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.productService.getProduct().subscribe({
      next: (response: any) => {
        console.log(response)
        this.products = response;
        this._cdr.detectChanges();
      }
    })
  }

  onProduct(event: string) {
    if (event === 'add') this.titleHeader = 'Add Product';
    if (event === 'edit') this.titleHeader = 'Edit Product';
    this.isShowAddProduct = true;
  }

  onCompleteProduct(event: any) {
    try {
      if (event.mode === 'cancel') this.isShowAddProduct = false;
      else if(event.mode === 'save') {
        this.productService.createProduct(event.data).subscribe({
          next: (response: any) => {
            console.log(response)
          }
        })
      }
    } catch (error) {

    }
    
  }

  onDelete() {
    this.alertService.confirmAlert('question', '', 'Confirm delete this product?' ).then((data) => {
      if (data.isConfirmed) {}
    })
  }

}
