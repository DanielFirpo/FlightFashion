export default {
  orders: async (ctx, next) => {
    try {
      console.log("working");
      if (!ctx.state.user) return ctx.badRequest("Not logged in.");
      const data = await strapi
        .service("api::ownedorders.ownedorders")
        .orders(ctx.state.user.id);
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
