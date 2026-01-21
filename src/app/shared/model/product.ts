export interface ProductsModel {
    balance_qty: number;
    barcode: string;
    brand_code: number;
    brand_name: string;
    category_code: number;
    category_name_en: string;
    category_name_th: string;
    cost_price: number;
    product_description: string;
    product_name: string;
    sku_code: string;
    status: string;
    supplier_code: number;
    supplier_name: string;
}

export interface WarehouseModel {
    warehouse_name: string;
    warehouse_zone?: string;
}

export interface BrandModel {
    _id?: string;
    brand_code?: number;
    brand_name?: string;
    created_at?: Date;
    created_by?: string;
    status?: string;
    updated_at?: Date;
    updated_by?: string;
}

export interface SupplierModel {
    _id?: string;
    supplier_code?: number;
    supplier_name?: string;
    created_at?: Date;
    created_by?: string;
    status?: string;
    updated_at?: Date;
    updated_by?: string;
}

export interface LotModel {
    lot_no: string;
}

export interface StatusModel {
    value: boolean;
}

export interface categoryModel {
    _id?: string;
    category_code?: number;
    category_name_en?: string;
    category_name_th?: string;
    status?: boolean;
}