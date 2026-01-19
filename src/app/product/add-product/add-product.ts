import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-add-product',
  imports: [ ButtonModule, DialogModule, InputTextModule, SelectModule, TextareaModule, ReactiveFormsModule, DatePickerModule ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {

  @Input() visible: boolean = false;
  @Input() titleHeader: string = '';
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  public categoryList: any[] = [];
  public brandCodeList: any[] = [];
  public unitList: any[] = [];
  public lotNoList: any[] = [];
  public stockTypeList: any[] = [];
  public productForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.productForm = new FormGroup({
      barcode: new FormControl({value: '', disabled: false},[Validators.required]),
      sku_code: new FormControl({value: '', disabled: false},[Validators.required]),
      product_name: new FormControl({value: '', disabled: false},[Validators.required]),
      product_description: new FormControl({value: '', disabled: false}),
      category_code: new FormControl({value: '', disabled: false},[Validators.required]),
      supplier_code: new FormControl({value: '', disabled: false},[Validators.required]),
      brand_code: new FormControl({value: '', disabled: false},[Validators.required]),
      unit: new FormControl({value: '', disabled: false},),
      cost_price: new FormControl({value: '', disabled: false}),
      lot_no: new FormControl({value: '', disabled: false}),
      warehouse_name: new FormControl({value: '', disabled: false},[Validators.required]),
      warehouse_zone: new FormControl({value: '', disabled: false},[Validators.required]),
      bin: new FormControl({value: '', disabled: false} ),
      stock_type: new FormControl({value: '', disabled: false}),
      receive_qty: new FormControl({value: '', disabled: false}),
      mfg: new FormControl({value: '', disabled: false}),
      exp: new FormControl({value: '', disabled: false}),
      created_by: new FormControl({value: '', disabled: false}),
      updated_by: new FormControl({value: '', disabled: false}),
    })
  }

  onSave() {
    this.onComplete.emit({ mode: 'save', data: this.productForm.value });
  }
  onCancel() {
    this.onComplete.emit({ mode: 'cancel' });
  }
}
