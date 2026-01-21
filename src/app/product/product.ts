import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { finalize, firstValueFrom } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { saveAs } from 'file-saver';
import { LoadingService } from '../shared/service/loading';
import { ProductsModel, WarehouseModel, LotModel, StatusModel, categoryModel } from '../shared/model/product';
import { cloneDeep } from 'lodash';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ ImportModule, AccordionModule, InputTextModule, SelectModule, ButtonModule, TableModule, AddProduct, MultiSelectModule, DialogModule ],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {

  public categoryList!: categoryModel[];
  public lotList!: LotModel[];
  public statusList: StatusModel[] = [{value: true}, {value: false}];
  public warehouseList!: WarehouseModel[];
  public products!: ProductsModel[];
  public isShowAddProduct: boolean = false;
  public titleHeader: string = '';
  public filterForm!: FormGroup;
  public uploadFile: any;
  public defaultTb!: ProductsModel[];
  public dataFilter: any;
  public totalRecords: number = 0;
 
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
      // barcode: new FormControl({value: '', disabled: false}),
      keyword: new FormControl({value: '', disabled: false}),
      sku_code: new FormControl({value: '', disabled: false}),
      category: new FormControl({value: '', disabled: false}),
      warehouse: new FormControl({value: '', disabled: false}),
      lot_no: new FormControl({value: '', disabled: false}),
      status: new FormControl({value: '', disabled: false}),
    })
  }

  async initData() {
    try {
      let [categories, lots, warehouse] = await Promise.all([
        firstValueFrom(this.productService.getDdlCategory()),
        firstValueFrom(this.productService.getDdlCategory()),
        firstValueFrom(this.productService.getDdlLot()),
        firstValueFrom(this.productService.getDdlWarehouse()),
      ])
      // let productRes: any = products;
      // this.totalRecords = productRes.total_data;
      // this.products = Array.isArray(productRes?.data) ? productRes?.data : [];
      this.categoryList = Array.isArray(categories) ? categories : [];
      this.lotList = Array.isArray(lots) ? lots : [];
      this.warehouseList = Array.isArray(warehouse) ? warehouse : [];
      this.defaultTb = cloneDeep(this.products);
      this._cdr.detectChanges();
      // console.log(productRes)
      this.loadingService.stop();
    } catch (error: any) {
      console.log(error)
      this.loadingService.stop();
      this.alertService.alert('error', '', error.error.message);
    }
  }

  getProduct(params?: any) {
    this.productService.getProduct(params).subscribe({
      next: (response: any) => {
        this.products = response?.data ?? [];
        this.totalRecords = response.total_data;
        this._cdr.markForCheck(); // ขอ Angular ตรวจรอบหน้า 
        this.loadingService.stop();
      }, error: (err) => {
        this.loadingService.stop();
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
    this.loadingService.start()
    const filterForm = this.filterForm.value;
    this.dataFilter = {
      limit: 10,
      page: 1,
      keyword: filterForm?.keyword,
      sku_code: filterForm?.sku_code,
      category_code: filterForm?.category?.category_code,
      warehouse_name: filterForm?.warehouse?.warehouse_name,
      lot_no: filterForm?.lot_no?.lot_no,
      status: filterForm?.status
    }
    this.getProduct(this.dataFilter);
  }

  onClear() {
    this.filterForm.reset();
    this.products = this.defaultTb;
  }

  onExport() {
    this.loadingService.start();
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
        this.loadingService.stop();
      }, error: (err) => {
        this.alertService.alert('error', '', err?.error?.message)
      }
    })
  }

  openFile(input: HTMLInputElement) {
    input.value = '';   
    input.click();
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.uploadFile = file;
     if (!this.uploadFile) return;
    if (this.uploadFile) {
      this.loadingService.start();
      this.productService.importExcel(this.uploadFile).pipe(finalize(() => {
        this.loadingService.stop();
        this.uploadFile = undefined;
        input.value = '';
      })).subscribe({
        next: (response: any) => {
          if (response?.result?.failed !== null) {
            this.alertService.alert('error', '', response?.result?.finalMassage);
            this.uploadFile = undefined;
          } else {
            this.alertService.alert('success', '', response.message).then((data) => {
              if (data.isConfirmed) {
                this.uploadFile = undefined;
                this.loadingService.start();
                this.getProduct(this.dataFilter);
              }
            })
          }
          
        },
        error: (err) => {
          this.loadingService.stop();
          this.alertService.alert('error', '', err.error.message)
        }
      })
    }
  }

  onLazyLoad(event: any) {
    let page: number = event.first / event.rows;
    page = page + 1;
    this.dataFilter = {...this.dataFilter, limit: event.rows, page: page};
    this.loadingService.start();
    this.getProduct(this.dataFilter)
  }
}
