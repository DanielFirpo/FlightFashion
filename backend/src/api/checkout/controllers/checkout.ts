module.exports = {
  async startCheckout(ctx, next) {
    console.log("entries", ctx.request.body);
    if (!ctx.request.body) {
      ctx.badRequest("Cart data not provided");
    }
    try {
      console.log("logged in user", ctx.state.user.id);
      const data = await strapi
        .service("api::checkout.checkout")
        .startCheckout(ctx.request.body, ctx.state.user.id);
      // console.log("sending response", data);
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Checkout controller error", { moreDetails: err });
    }
  },
  async finishCheckout(ctx, next) {
    try {
      if (!ctx.request.query.session_id)
        return ctx.badRequest("Checkout controller error");

      const url = await strapi
        .service("api::checkout.checkout")
        .finishCheckout(
          ctx.request.query.session_id,
          ctx.request.query.user_id,
        );

      ctx.redirect(url);
      return;
    } catch (err) {
      console.log(err);
      ctx.badRequest("Checkout controller error", { moreDetails: err });
    }
  },
};
