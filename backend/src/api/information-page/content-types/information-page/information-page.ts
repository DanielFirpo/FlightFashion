// Interface automatically generated by schemas-to-ts

export interface InformationPage {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    title: string;
    text: string;
    slug?: string;
  };
}
export interface InformationPage_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  title: string;
  text: string;
  slug?: string;
}

export interface InformationPage_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  title: string;
  text: string;
  slug?: string;
}

export interface InformationPage_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  title: string;
  text: string;
  slug?: string;
}
