const BaseRepository = require('./BaseRepository');

class StudentRepository extends BaseRepository {
  findActiveById(id) {
    return this.findOne({ _id: id, isActive: true });
  }

  updateActiveById(id, update) {
    return this.updateOne({ _id: id, isActive: true }, update, { new: true, runValidators: true });
  }

  softDeleteById(id) {
    return this.updateOne(
      { _id: id, isActive: true },
      { isActive: false, status: 'ALUMNI' },
      { new: true }
    );
  }
}

module.exports = StudentRepository;
