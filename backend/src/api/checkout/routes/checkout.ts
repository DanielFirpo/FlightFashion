module.exports = {
  routes: [
    {
      method: "POST",
      path: "/checkout",
      handler: "checkout.startCheckout",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/checkout-return",
      handler: "checkout.finishCheckout",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
