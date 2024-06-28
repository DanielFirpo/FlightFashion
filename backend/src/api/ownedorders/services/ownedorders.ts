module.exports = {
  orders: async (userId: string) => {
    console.log("getting orders of user", userId);
    const orders = await strapi.entityService.findMany("api::order.order", {
      filters: { user: { id: userId } },
    });

    return orders;
  },
};
