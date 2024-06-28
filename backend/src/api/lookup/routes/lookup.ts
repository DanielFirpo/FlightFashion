module.exports = {
  routes: [
    {
      method: "GET",
      path: "/order-by-reference",
      handler: "lookup.lookup",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
