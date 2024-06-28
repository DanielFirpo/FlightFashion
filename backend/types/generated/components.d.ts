import type { Schema, Attribute } from '@strapi/strapi';

export interface ProductInventory extends Schema.Component {
  collectionName: 'components_product_inventories';
  info: {
    displayName: 'Inventory';
    icon: 'briefcase';
    description: '';
  };
  attributes: {
    product_color: Attribute.Relation<
      'product.inventory',
      'oneToOne',
      'api::product-color.product-color'
    >;
    product_size: Attribute.Relation<
      'product.inventory',
      'oneToOne',
      'api::product-size.product-size'
    >;
    quantity: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<0>;
  };
}

export interface ProductOrderProduct extends Schema.Component {
  collectionName: 'components_product_order_products';
  info: {
    displayName: 'orderProduct';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    product_color: Attribute.Relation<
      'product.order-product',
      'oneToOne',
      'api::product-color.product-color'
    >;
    product_size: Attribute.Relation<
      'product.order-product',
      'oneToOne',
      'api::product-size.product-size'
    >;
    quantity: Attribute.Integer & Attribute.Required;
    product: Attribute.Relation<
      'product.order-product',
      'oneToOne',
      'api::product.product'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'product.inventory': ProductInventory;
      'product.order-product': ProductOrderProduct;
    }
  }
}
