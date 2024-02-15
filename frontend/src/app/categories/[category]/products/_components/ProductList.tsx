"use client";

import { ReactNode } from "react";

export default async function ProductList(props: {
  category: string;
  children: ReactNode;
}) {
  return (
    <div>
      {props.children}
      LIST OF PRODUCTS HERE OF CATEGORYy {props.category}
    </div>
  );
}
