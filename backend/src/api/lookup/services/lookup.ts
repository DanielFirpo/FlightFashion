module.exports = {
  lookup: async (referenceId: string) => {
    const order = await strapi.entityService.findMany("api::order.order", {
      filters: { referenceId: referenceId },
      populate: { purchasedVariants: { populate: "*" } },
    });

    return order[0];
  },
};
