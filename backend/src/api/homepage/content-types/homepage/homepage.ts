// Interface automatically generated by schemas-to-ts

import { Link } from '../../../link/content-types/link/link';
import { Media } from '../../../../common/schemas-to-ts/Media';
import { Link_Plain } from '../../../link/content-types/link/link';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface Homepage {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    heroTitle: string;
    heroSubtitle: string;
    heroButton?: { data: Link };
    heroImage: { data: Media };
    leftHalfImage: { data: Media };
    rightHalfTitle: string;
    rightHalfText: string;
    wideImage: { data: Media };
    wideImageText: string;
    column1Title: string;
    column2Title: string;
    column3Title: string;
    column4Title: string;
    column1Text: string;
    column2Text: string;
    column3Text: string;
    column4Text: string;
    saleImage?: { data: Media };
    saleImageTitle: string;
    saleText: string;
    saleDiscount: string;
    saleButton?: { data: Link };
  };
}
export interface Homepage_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  heroTitle: string;
  heroSubtitle: string;
  heroButton?: Link_Plain;
  heroImage: Media;
  leftHalfImage: Media;
  rightHalfTitle: string;
  rightHalfText: string;
  wideImage: Media;
  wideImageText: string;
  column1Title: string;
  column2Title: string;
  column3Title: string;
  column4Title: string;
  column1Text: string;
  column2Text: string;
  column3Text: string;
  column4Text: string;
  saleImage?: Media;
  saleImageTitle: string;
  saleText: string;
  saleDiscount: string;
  saleButton?: Link_Plain;
}

export interface Homepage_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  heroTitle: string;
  heroSubtitle: string;
  heroButton?: number;
  heroImage: number;
  leftHalfImage: number;
  rightHalfTitle: string;
  rightHalfText: string;
  wideImage: number;
  wideImageText: string;
  column1Title: string;
  column2Title: string;
  column3Title: string;
  column4Title: string;
  column1Text: string;
  column2Text: string;
  column3Text: string;
  column4Text: string;
  saleImage?: number;
  saleImageTitle: string;
  saleText: string;
  saleDiscount: string;
  saleButton?: number;
}

export interface Homepage_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  heroTitle: string;
  heroSubtitle: string;
  heroButton?: AdminPanelRelationPropertyModification<Link_Plain>;
  heroImage: AdminPanelRelationPropertyModification<Media>;
  leftHalfImage: AdminPanelRelationPropertyModification<Media>;
  rightHalfTitle: string;
  rightHalfText: string;
  wideImage: AdminPanelRelationPropertyModification<Media>;
  wideImageText: string;
  column1Title: string;
  column2Title: string;
  column3Title: string;
  column4Title: string;
  column1Text: string;
  column2Text: string;
  column3Text: string;
  column4Text: string;
  saleImage?: AdminPanelRelationPropertyModification<Media>;
  saleImageTitle: string;
  saleText: string;
  saleDiscount: string;
  saleButton?: AdminPanelRelationPropertyModification<Link_Plain>;
}
