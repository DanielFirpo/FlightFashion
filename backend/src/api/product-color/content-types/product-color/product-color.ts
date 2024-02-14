// Interface automatically generated by schemas-to-ts

import { Product } from '../../../product/content-types/product/product';
import { Product_Plain } from '../../../product/content-types/product/product';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface ProductColor {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    name: string;
    hex: string;
    fee: number;
    product?: { data: Product };
  };
}
export interface ProductColor_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  hex: string;
  fee: number;
  product?: Product_Plain;
}

export interface ProductColor_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  hex: string;
  fee: number;
  product?: number;
}

export interface ProductColor_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  hex: string;
  fee: number;
  product?: AdminPanelRelationPropertyModification<Product_Plain>;
}
