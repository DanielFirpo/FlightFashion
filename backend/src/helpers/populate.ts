/*********************************
 * Poplulate All Attributes
 *
 * https://forum.strapi.io/t/strapi-v4-populate-media-and-dynamiczones-from-components/12670/2
 *
 *********************************/

const { createCoreController } = require("@strapi/strapi").factories;

const populateAttribute = ({ components }) => {
  if (components) {
    const populate = components.reduce((currentValue, current) => {
      const [componentDir, componentName] = current.split(".");

      /* Component attributes needs to be explicitly populated */
      const componentAttributes = Object.entries(
        require(`../components/${componentDir}/${componentName}.json`)
          .attributes,
      ).filter(([, v]: [string, { type: string }]) => v.type === "component");

      const attrPopulates = componentAttributes.reduce(
        (acc, [curr]) => ({ ...acc, [curr]: { populate: "*" } }),
        {},
      );

      return {
        ...currentValue,
        [current.split(".").pop()]: { populate: "*" },
        ...attrPopulates,
      };
    }, {});
    return { populate };
  }
  return { populate: "*" };
};

const getPopulateFromSchema = function (schema) {
  return Object.keys(schema.attributes).reduce((currentValue, current) => {
    const attribute = schema.attributes[current];
    if (!["dynamiczone", "component"].includes(attribute.type)) {
      return { ...currentValue, [current]: populateAttribute(attribute) };
    }
    return {
      ...currentValue,
      [current]: populateAttribute(attribute),
    };
  }, {});
};

function createPopulatedController(uid, schema) {
  return createCoreController(uid, () => {
    // console.log(schema.collectionName, getPopulateFromSchema(schema))
    return {
      async find(ctx) {
        // deeply populate all attributes with ?populate=*, else retain vanilla functionality
        if (ctx.query.populate?.includes("*")) {
          ctx.query = {
            ...ctx.query,
            populate: {
              ...getPopulateFromSchema(schema),
            },
          };
        }
        return await super.find(ctx);
      },
      async findOne(ctx) {
        if (ctx.query.populate === "*") {
          ctx.query = {
            ...ctx.query,
            populate: getPopulateFromSchema(schema),
          };
        }
        return await super.findOne(ctx);
      },
    };
  });
}

module.exports = createPopulatedController;
