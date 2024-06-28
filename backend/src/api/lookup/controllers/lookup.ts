module.exports = {
  async lookup(ctx, next) {
    try {
      if (!ctx.request.query.referenceId)
        return ctx.badRequest("referenceId query param missing");
      const data = await strapi
        .service("api::lookup.lookup")
        .lookup(ctx.request.query.referenceId);

      if (!data)
        ctx.throw(
          404,
          "No order found with id " + ctx.request.query.referenceId,
        );
      ctx.body = data;
      return;
    } catch (err) {
      console.log(err);
      ctx.badRequest("Lookup controller error", { moreDetails: err });
    }
  },
};
