"use client";

import { useEffect, useState } from "react";
import { Product } from "@apiTypes/product/content-types/product/product";
import { ProductSize } from "@apiTypes/product-size/content-types/product-size/product-size";
import { ProductColor } from "@apiTypes/product-color/content-types/product-color/product-color";
import { useToast } from "@/src/app/_components/shadcn/use-toast";
import { ToastAction } from "@/src/app/_components/shadcn/toast";
import { cn } from "@/src/app/_utils/shadUtils";
import clsx from "clsx";
import PriceDisplay from "../../_components/PriceDisplay";
import { StoredCartItem, ItemVariant } from "@/src/app/cart/page";

export default function ProductForm(props: { productData: Product }) {
  const { toast } = useToast();

  const productData = props.productData;

  const [colorSelection, setColorSelection] = useState<ProductColor | undefined>(
    props.productData.attributes.product_colors?.data[0],
  );
  const [sizeSelection, setSizeSelection] = useState<ProductSize | undefined>(
    props.productData.attributes.product_sizes?.data[0],
  );
  const [quantitySelection, setQuantitySelection] = useState<number>(1);

  const [storedItems, setStoredItems] = useState<StoredCartItem[]>([]);

  const inputTitleClasses = "font-dmSans font-semibold text-medium mt-6";

  useEffect(() => {
    setStoredItems(JSON.parse(localStorage.getItem("cartItems") || `[]`));
  }, []);

  return (
    <div>
      <div>
        {/* Color Selector */}
        <div className={inputTitleClasses}>Color</div>
        <div className="mb-1.5 mt-3 flex">
          {productData.attributes.product_colors?.data.map((color: ProductColor) => {
            return (
              <div onClick={() => setColorSelection(color)} key={color.attributes.name + color.id} className="relative">
                <button
                  style={{
                    backgroundColor: color.attributes.hex,
                    boxShadow: "0px 0px 5px 3px rgba(0,0,0,0.2)",
                  }}
                  className={clsx(
                    "mb-2 mr-3 h-6 w-6 rounded-full before:absolute",
                    color.id === colorSelection?.id &&
                      "before:left-0 before:top-full before:w-6 before:border-b-2 before:border-highlightYellow",
                  )}
                ></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <div className={inputTitleClasses}>Size</div>
        <div className="mt-3">
          {productData.attributes.product_sizes?.data.map((size: ProductSize) => {
            return (
              <button
                onClick={() => setSizeSelection(size)}
                key={size.attributes.name}
                className={clsx(
                  "mb-1 mr-3 h-7 rounded-lg border-1.5 border-black px-3 text-xs",
                  size.id === sizeSelection?.id && "border-none bg-highlightYellow",
                )}
              >
                {size.attributes.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Display */}
      <div className={inputTitleClasses}>Total Price</div>
      <div className="flex max-w-[30rem]">
        <div className="my-3 flex w-full flex-wrap justify-between">
          <PriceDisplay
            product={productData}
            fees={(sizeSelection?.attributes.fee ?? 0) + (colorSelection?.attributes.fee ?? 0)}
            quantity={quantitySelection}
            className="items-center gap-6"
          ></PriceDisplay>

          {/* Quantity Selector */}
          <div className="flex justify-between">
            <button
              onClick={() => setQuantitySelection(quantitySelection - 1 < 1 ? 1 : quantitySelection - 1)}
              className="h-7 w-7 rounded-lg bg-black text-center text-white"
            >
              <span className="icon-[ph--arrow-left-bold] mb-0.5 size-4 align-middle"></span>
            </button>
            <input
              value={quantitySelection + ""}
              type="number"
              onChange={(e) => {
                let parsedQuantity = parseInt(
                  e.target.value.replace(/^0+/, "") === "" ? "0" : e.target.value.replace(/^0+/, ""),
                  10,
                );
                parsedQuantity = parsedQuantity > 1000 ? 1000 : parsedQuantity;
                parsedQuantity = parsedQuantity < 1 ? 1 : parsedQuantity;

                setQuantitySelection(parsedQuantity);
              }}
              className="mx-1.5 flex h-7 min-w-7 items-center justify-center rounded-lg border-1.5 border-black
                   bg-transparent px-0.5 text-center text-sm focus:outline-none"
              style={{
                width: 10 + quantitySelection.toString().length * 9 + "px",
              }}
            ></input>
            <button
              onClick={() => setQuantitySelection(quantitySelection + 1 > 1000 ? quantitySelection : quantitySelection + 1)}
              className="h-7 w-7 rounded-lg bg-black text-center text-white"
            >
              <span className="icon-[ph--arrow-right-bold] mb-0.5 size-4 align-middle"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="mt-7 flex">
        <button
          onClick={() => {
            const undoFunction = updateStoredItem(quantitySelection, colorSelection, sizeSelection, productData, storedItems);
            toast({
              duration: 2500,
              className: cn("top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"),
              title: "Added to Cart",
              description: quantitySelection + "x " + productData.attributes.name,
              action: (
                <ToastAction
                  onClick={() => {
                    undoFunction();
                  }}
                  altText="Go to cart to undo"
                >
                  Undo
                </ToastAction>
              ),
            });
          }}
          className="flex items-center justify-center rounded-xl bg-highlightYellow px-6 py-3 font-dmSans font-semibold"
        >
          <span className="icon-[heroicons--shopping-bag] mr-2 size-5"></span>
          Add to Cart
        </button>
        {/* Add to Favorites */}
        <button
          onClick={() => {
            toast({
              className: cn("top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"),
              title: "Added to Favorites",
              description: productData.attributes.name,
            });
          }}
          className="ml-3 flex h-12 w-12 items-center justify-center rounded-xl border-1.5
                 border-black px-3"
        >
          <span className="icon-[carbon--favorite] size-5"></span>
        </button>
      </div>
    </div>
  );

  // TODO: there must be a way to make this func less convoluted, right?
  function updateStoredItem(
    quantityAdjustment: number,
    colorSelection: ProductColor | undefined,
    sizeSelection: ProductSize | undefined,
    productData: Product,
    storedItems: StoredCartItem[],
  ) {
    //undo return will use this to revert the state back.
    const restorePoint = structuredClone(storedItems);

    console.log(storedItems);

    const existingItem = storedItems.find((item) => productData.id === item.id);

    if (!existingItem) {
      storedItems.push({
        id: productData.id,
        variantQuantities: [
          {
            colorId: colorSelection?.id,
            sizeId: sizeSelection?.id,
            quantity: quantityAdjustment,
          },
        ],
      });
    } else {
      const existingVariant = existingItem.variantQuantities.find(
        (variant) => variant.colorId === colorSelection?.id && variant.sizeId === sizeSelection?.id,
      );
      if (!existingVariant) {
        existingItem.variantQuantities.push({
          colorId: colorSelection?.id,
          sizeId: sizeSelection?.id,
          quantity: quantityAdjustment,
        });
      } else {
        existingVariant.quantity += quantityAdjustment;
      }
    }

    //storedItems has been modified, setStoredItems and localStorage to retain changes
    window.localStorage.setItem("cartItems", JSON.stringify(storedItems));
    setStoredItems(storedItems);
    window.dispatchEvent(new Event("storage"));

    return function undo() {
      window.localStorage.setItem("cartItems", JSON.stringify(restorePoint));
      setStoredItems(restorePoint);
      window.dispatchEvent(new Event("storage"));
    };
  }
}
