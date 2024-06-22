/**
 * product controller
 */
const collectionType = "product";

const schema = require(`../content-types/${collectionType}/schema.json`);
const createPopulatedProductController = require("../../../helpers/populate");

module.exports = createPopulatedProductController(
  `api::${collectionType}.${collectionType}`,
  schema,
);
