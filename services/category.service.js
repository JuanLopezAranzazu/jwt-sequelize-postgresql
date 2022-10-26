const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");

class CategoryService {
  constructor() {}

  async findAll() {
    const categories = await models.Category.findAll({});
    return categories;
  }

  async findOne(id) {
    const category = await models.Category.findOne({
      where: { id },
    });
    if (!category) throw boom.notFound(`Category #${id} not found`);
    return category;
  }

  async create(payload) {
    const savedCategory = await models.Category.create(payload);
    return savedCategory;
  }

  async update(id, payload) {
    const category = await this.findOne(id);
    if (!category) throw boom.notFound(`Category #${id} not found`);
    const updatedCategory = await note.update(payload);
    return updatedCategory;
  }

  async delete(id) {
    const category = await this.findOne(id);
    if (!category) throw boom.notFound(`Category #${id} not found`);
    await category.destroy();
    return id;
  }
}

module.exports = CategoryService;
