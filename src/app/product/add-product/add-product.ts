import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrandModel, SupplierModel, WarehouseModel, LotModel, categoryModel } from '../../shared/model/product';
import { ProductService } from '../../shared/service/product';
import { firstValueFrom } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-add-product',
  imports: [ ButtonModule, DialogModule, InputTextModule, SelectModule, TextareaModule, ReactiveFormsModule, 
    DatePickerModule, MultiSelectModule, InputNumberModule ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {

  @Input() visible: boolean = false;
  @Input() titleHeader: string = '';
  @Input() categoryList!: categoryModel[];
  @Input() warehouseList!: WarehouseModel[];
  @Input() lotNoList!: LotModel[];
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  public brandList!: BrandModel[];
  public supplierList!: SupplierModel[];
  public stockTypeList: any[] = [
    {id: 'Normal'},
    {id: 'Cool'},
    {id: 'Freezer'},
  ];
  public productForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initDropdown();

    this.productForm = new FormGroup({
      barcode: new FormControl({value: '', disabled: false},[Validators.required]),
      sku_code: new FormControl({value: '', disabled: false},[Validators.required]),
      product_name: new FormControl({value: '', disabled: false},[Validators.required]),
      product_description: new FormControl({value: '', disabled: false}),
      category: new FormControl({value: '', disabled: false},[Validators.required]),
      supplier: new FormControl({value: '', disabled: false},[Validators.required]),
      brand: new FormControl({value: '', disabled: false},[Validators.required]),
      unit: new FormControl({value: null, disabled: false},),
      cost_price: new FormControl({value: null, disabled: false}),
      lot_no: new FormControl({value: '', disabled: false}),
      warehouse: new FormControl({value: '', disabled: false},[Validators.required]),
      bin: new FormControl({value: '', disabled: false} ),
      stock_type: new FormControl({value: '', disabled: false}),
      receive_qty: new FormControl({value: null, disabled: false}),
      mfg: new FormControl({value: '', disabled: false}),
      exp: new FormControl({value: '', disabled: false}),
      created_by: new FormControl({value: '', disabled: false}),
      updated_by: new FormControl({value: '', disabled: false}),
    })
  }

  async initDropdown() {
    try {
      const [brand, supplier] = await Promise.all([
        firstValueFrom(this.productService.getDdlBrand()),
        firstValueFrom(this.productService.getDdlSupplier())
      ])
      this.brandList = Array.isArray(brand) ? brand : [];
      this.supplierList = Array.isArray(supplier) ? supplier : [];
      this._cdr.detectChanges();
    } catch (error) {

    }
  }

  onSave() {
    if(this.productForm.valid) {
      this.onComplete.emit({ mode: 'save', data: this.productForm.value });
    } else this.productForm.markAllAsTouched();
  }

  onCancel() {
    this.productForm.reset();

    const main = document.querySelector('.router-container') as HTMLElement;
    if (!main) return;

    main.style.overflow = 'auto';

    this.onComplete.emit({ mode: 'cancel' });
  }

  lockScroll() {
    const main = document.querySelector('.router-container') as HTMLElement;
    if (!main) return;

    main.style.overflow = 'hidden';
  }
}
