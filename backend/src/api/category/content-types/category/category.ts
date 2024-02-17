// Interface automatically generated by schemas-to-ts

import { Product } from '../../../product/content-types/product/product';
import { Product_Plain } from '../../../product/content-types/product/product';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface Category {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    name: string;
    bannerText: string;
    products: { data: Product[] };
    slug: string;
  };
}
export interface Category_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  bannerText: string;
  products: Product_Plain[];
  slug: string;
}

export interface Category_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  bannerText: string;
  products: number[];
  slug: string;
}

export interface Category_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  bannerText: string;
  products: AdminPanelRelationPropertyModification<Product_Plain>;
  slug: string;
}
