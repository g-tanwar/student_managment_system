class BaseRepository {
  constructor(model) {
    if (!model) throw new Error('BaseRepository requires a model');
    this.model = model;
  }

  create(doc) {
    return this.model.create(doc);
  }

  findOne(filter, projection, options) {
    return this.model.findOne(filter, projection, options);
  }

  find(filter, projection, options) {
    return this.model.find(filter, projection, options);
  }

  count(filter) {
    return this.model.countDocuments(filter);
  }

  findById(id, projection, options) {
    return this.model.findById(id, projection, options);
  }

  updateOne(filter, update, options) {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateById(id, update, options) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
