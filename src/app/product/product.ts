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
import { LoadingService } from '../shared/service/loading';
import { ProductsModel, WarehouseModel } from '../shared/model/product';

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
  public warehouseList!: WarehouseModel[];
  public products!: ProductsModel[];
  public isShowAddProduct: boolean = false;
  public titleHeader: string = '';
  public filterForm!: FormGroup;
  public uploadFile: any;
 
  constructor(
    private alertService: AlertService,
    private productService: ProductService,
    private loadingService: LoadingService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadingService.start();
    this.initFrom();
    this.initData();
    // this.initDropdown();
  }

  initFrom() {
    this.filterForm = new FormGroup({
      barcode: new FormControl({value: '', disabled: false}),
      keyword: new FormControl({value: '', disabled: false}),
      sku_code: new FormControl({value: '', disabled: false}),
      category_code: new FormControl({value: '', disabled: false}),
      warehouse_name: new FormControl({value: '', disabled: false}),
      lot_no: new FormControl({value: '', disabled: false}),
      status: new FormControl({value: '', disabled: false}),
    })
  }

  async initData() {
    try {
      const [products, categories, lots, warehouse] = await Promise.all([
        firstValueFrom(this.productService.getProduct({limit: 10, page: 1})),
        firstValueFrom(this.productService.getDdlCategory()),
        firstValueFrom(this.productService.getDdlLot()),
        firstValueFrom(this.productService.getDdlWarehouse()),
      ])
      this.products = Array.isArray(products) ? products : [];
      this.categoryList = Array.isArray(categories) ? categories : [];
      this.lotList = Array.isArray(lots) ? lots : [];
      this.warehouseList = Array.isArray(warehouse) ? warehouse : [];
      console.log(lots)
      this._cdr.detectChanges();
      this.loadingService.stop();
    } catch (error: any) {
      this.loadingService.stop();
      this.alertService.alert('error', '', error.error.message);
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
        this.alertService.alert('error', '', err.message);
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
        const data = event.data;
        const dataCreate = {...data, 
          category_code: Number(data?.category?.category_code),
          supplier_code: Number(data?.supplier?.supplier_code),
          brand_code: Number(data?.brand?.brand_code),
          lot_no: data?.lot_no?.lot_no,
          warehouse_name: data?.warehouse?.warehouse_name,
          warehouse_zone: data?.warehouse?.warehouse_zone,
        }
        console.log(dataCreate)
        this.productService.createProduct(dataCreate).subscribe({
          next: (response: any) => {
            if (response.status_code === 201) {
              this.alertService.alert('success', '', response.message).then((data) => {
                if (data.isConfirmed) {
                  this.isShowAddProduct = false;
                  this.getProduct();
                }
              })
            }
          },
          error: (err) => {
            this.alertService.alert('error', '', err?.error?.message || 'Internal Server Error')
          },
        })
      }
    } catch (error) {
      this.alertService.alert('error', '', 'Internal Server Error')
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

  onFileSelect(event: any) {
    this.uploadFile = event.target.files[0];
    if (this.uploadFile) {
      this.loadingService.start();
      this.productService.importExcel(this.uploadFile).subscribe({
        next: (response: any) => {
          this.loadingService.stop();
          this.alertService.alert('success', '', response.message).then((data) => {
            if (data.isConfirmed) {
              console.log(response)
            }
          })
        },
        error: (err) => {
          this.loadingService.stop();
          this.alertService.alert('error', '', err.error.message)
        }
      })
    }
  }

  pageChange(event: any) {
    console.log(event)
  }
}
