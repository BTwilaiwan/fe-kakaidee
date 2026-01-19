import { Component, ChangeDetectorRef } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AddProduct } from './add-product/add-product';
import { AlertService } from '../shared/service/alert';
import { ProductService } from '../shared/service/product';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportModule } from '../shared/importModule';
import { firstValueFrom } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ ImportModule, AccordionModule, InputTextModule, SelectModule, ButtonModule, TableModule, AddProduct, MultiSelectModule ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {

  public categoryList: any[] = [];
  public lotList: any[] = [];
  public statusList: any[] = [];
  public brandList: any[] = [];
  public products: any[] = [];
  public isShowAddProduct: boolean = false;
  public titleHeader: string = '';
  public filterForm!: FormGroup;
 
  constructor(
    private alertService: AlertService,
    private productService: ProductService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initFrom();
    this.initData();
    // this.initDropdown();
  }

  initFrom() {
    this.filterForm = new FormGroup({
      barcode: new FormControl({value: '', disabled: false}),
      keyword: new FormControl({value: '', disabled: false}),
      sku_code: new FormControl({value: '', disabled: false}),
      category_code: new FormControl({value: [], disabled: false}),
      warehouse_name: new FormControl({value: '', disabled: false}),
      lot_no: new FormControl({value: '', disabled: false}),
      status: new FormControl({value: '', disabled: false}),
    })
  }

  async initData() {
    try {
      const [products, categories] = await Promise.all([
        firstValueFrom(this.productService.getProduct()),
        firstValueFrom(this.productService.getDdlCategory()),
        // firstValueFrom(this.productService.getDdlLot()),
      ])
      this.products = Array.isArray(products) ? products : [];
      this.categoryList = Array.isArray(categories) ? categories : [];
      // this.lotList = Array.isArray(lots) ? lots : [];
    } catch (error) {

    }
  }

  getProduct(params?: any) {
    this.productService.getProduct(params).subscribe({
      next: (response: any) => {
        this.products = response;
        this._cdr.detectChanges();
        console.log(this.products)
      },
        error: (err) => {
        this.alertService.alert('error', err.message);
        this.products = [];
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
            if (response.status_code === 201) {
              this.alertService.alert('success', response.message).then((data) => {
                if (data.isConfirmed) {
                  this.isShowAddProduct = false;
                  this.getProduct();
                }
              })
            }
          },
          error: (err) => {
            this.alertService.alert('error', err?.error?.message || 'Internal Server Error')
          },
        })
      }
    } catch (error) {
      this.alertService.alert('error', 'Internal Server Error')
    }
  }

  onDelete() {
    this.alertService.confirmAlert('question', '', 'Confirm delete this product?' ).then((data) => {
      if (data.isConfirmed) {}
    })
  }

  onFilter() {
    const filterForm = this.filterForm.value;
    const dataFilter = {
      keyword: filterForm.keyword,
      sku_code: filterForm.sku_code,
      category_code: filterForm.category_code,
      warehouse_name: filterForm.warehouse_name,
      lot_no: filterForm.lot_no,
      status: filterForm.status
    }
    this.getProduct(dataFilter);
  }

  onClear() {
    this.filterForm.reset();
    this.getProduct();
  }

  onExport() {
    this.productService.exportExcel().subscribe({
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
      }
    })
  }
}
