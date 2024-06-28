import { Product_Plain } from "../../product/content-types/product/product";
import {
  Inventory,
  Inventory_Plain,
} from "../../../components/product/interfaces/Inventory";
import { MediaFormat } from "../../../common/schemas-to-ts/MediaFormat";
import { Order_Plain } from "../../order/content-types/order/order";
import { ID } from "@strapi/types/dist/types/core/entity";
import { v4 as uuidv4 } from "uuid";

const stripe = require("stripe")(process.env.STRIPE_KEY);

type VariantQuantity = {
  variantId: string;
  colorId: number;
  quantity: number;
  sizeId?: number; // sizeId is optional
};

type RequestData = {
  id: number;
  variantQuantities: VariantQuantity[];
}[];

module.exports = {
  startCheckout: async (cartItems: RequestData, userId: string) => {
    console.log("start checkout user id", userId);
    try {
      const entries: Product_Plain[] = await strapi.entityService.findMany(
        "api::product.product",
        {
          filters: {
            id: { $in: cartItems.map((item) => item.id) },
          },
          fields: ["id", "price", "discountPercent", "name"],
          populate: {
            variantInventory: { populate: "*" },
            product_colors: { populate: "*" },
            product_sizes: { populate: "*" },
            images: { populate: "*" },
          },
        },
      );

      const checkoutObject = {
        line_items: cartItems.flatMap((cartItem) => {
          return cartItem.variantQuantities.map((variant) => {
            const product = entries.find((entry) => entry.id === cartItem.id);

            const productVariant = product.variantInventory.find(
              (inventory: Inventory_Plain & { id: string }) => {
                if (inventory.id == variant.variantId) {
                  return true;
                }
              },
            );

            if (productVariant.quantity < variant.quantity) {
              throw new Error("Trying to buy more than is in stock.");
            }

            const color = getColorById(product, variant.colorId);
            const size = getSizeById(product, variant.sizeId);

            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${color.name}, ${size.name} ${product.name}`,
                  images: [
                    process.env.STRAPI_URL +
                      (product.images[0] as unknown as MediaFormat).url,
                  ],
                  metadata: {
                    id: product.id,
                    color: color.id,
                    size: size.id,
                    variantId: variant.variantId,
                  },
                },
                unit_amount: Math.round(
                  getPriceAfterDiscounts(product, variant).discountedPrice *
                    100,
                ),
              },
              quantity: variant.quantity,
            };
          });
        }),
        mode: "payment",
        ui_mode: "embedded",
        return_url: `${process.env.STRIPE_RETURN_URL}&user_id=${userId}`,
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
      };

      console.log("checkoutObject", checkoutObject);

      const session = await stripe.checkout.sessions.create(checkoutObject);

      console.log("returning");
      return { clientSecret: session.client_secret };
    } catch (err) {
      console.log(err);
      return { clientSecret: undefined };
    }
  },
  finishCheckout: async (sessionId: string, userId: string) => {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["line_items", "line_items.data.price.product"],
      },
    );
    const lineItems = sessionWithLineItems.line_items.data;

    const referenceId = uuidv4();

    //TODO: store data about which variants were bought instead of just which product
    const newOrder = await strapi.entityService.create("api::order.order", {
      data: {
        publishedAt: Date.now(),
        referenceId: referenceId,
        purchasedVariants: lineItems.map((item) => {
          return {
            product_color: item.price.product.metadata.color,
            product_size: item.price.product.metadata.size,
            quantity: item.quantity,
            product: item.price.product.metadata.id,
          };
        }),
        status: "Shipped",
        ...(userId !== "undefined" ? { user: userId } : {}),
        total: lineItems.reduce((all, cur) => {
          return all + (cur.amount_total + cur.amount_tax) / 100;
        }, 0),
      },
    });

    console.log("new order created", newOrder);

    //reduce inventory of items they purchased

    type VariantsAndNewQuantities = { id: ID; quantity: number };
    //map product id => array of variants needing to be updated
    let variantsAndNewQuantities: Map<string, VariantsAndNewQuantities[]> =
      new Map();

    for (const item of lineItems) {
      const productToModify = await strapi.entityService.findOne(
        "api::product.product",
        item.price.product.metadata.id,
        {
          fields: "*",
          populate: "*",
        },
      );

      productToModify.variantInventory.forEach((variant) => {
        // Found a variant we need to reduce

        if (item.price.product.metadata.variantId == variant.id) {
          console.log("item.price.product.metadata.variantId == variant.id");
          if (variantsAndNewQuantities.has(item.price.product.metadata.id)) {
            console.log(
              "variantsAndNewQuantities.has(item.price.product.metadata.id, pushing",
              {
                id: variant.id,
                quantity: variant.quantity - item.quantity,
              },
            );
            variantsAndNewQuantities.get(item.price.product.metadata.id).push({
              id: variant.id,
              quantity: variant.quantity - item.quantity,
            });
          } else {
            console.log("else setting new array", [
              {
                id: variant.id,
                quantity: variant.quantity - item.quantity,
              },
            ]);
            variantsAndNewQuantities.set(item.price.product.metadata.id, [
              {
                id: variant.id,
                quantity: variant.quantity - item.quantity,
              },
            ]);
          }
        }
      });
    }

    console.log(
      "variantsAndNewQuantities",
      variantsAndNewQuantities,
      variantsAndNewQuantities.keys(),
    );

    Array.from(variantsAndNewQuantities.keys()).forEach((key) => {
      console.log("updating a product with the following data:", {
        data: {
          variantInventory: variantsAndNewQuantities.get(key),
        },
      });
    });

    Array.from(variantsAndNewQuantities.keys()).forEach((key) => {
      strapi.entityService.update("api::product.product", key, {
        data: {
          variantInventory: variantsAndNewQuantities.get(key),
        },
      });
    });

    console.log("sessionWithLineItems", sessionWithLineItems);
    return (
      process.env.STRIPE_RETURN_REDIRECT_URL + "?referenceId=" + referenceId
    );
  },
};

function getPriceAfterDiscounts(
  product: Product_Plain,
  variant: VariantQuantity,
): { totalPrice: number; discountedPrice: number } {
  let totalPrice = 0;

  const colorFee = getColorById(product, variant.colorId)?.fee ?? 0;
  const sizeFee = getSizeById(product, variant.sizeId)?.fee ?? 0;
  totalPrice += product.price + colorFee + sizeFee;

  const discountedPrice =
    totalPrice - totalPrice * (product.discountPercent / 100);

  return { totalPrice, discountedPrice };
}

const getColorById = (product: Product_Plain, colorId: number | undefined) =>
  product.product_colors?.find((color) => color.id === colorId);

const getSizeById = (product: Product_Plain, sizeId: number | undefined) =>
  product.product_sizes?.find((size) => size.id === sizeId);
