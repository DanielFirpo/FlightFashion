export default {
  routes: [
    {
      method: "GET",
      path: "/owned-orders",
      handler: "ownedorders.orders",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
