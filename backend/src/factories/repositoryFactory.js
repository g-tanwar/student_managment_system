const BaseRepository = require('../repositories/BaseRepository');
const StudentRepository = require('../repositories/StudentRepository');

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');
const Mark = require('../models/Mark');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');

const MODEL_REGISTRY = {
  user: User,
  student: Student,
  teacher: Teacher,
  class: Class,
  section: Section,
  subject: Subject,
  exam: Exam,
  mark: Mark,
  attendance: Attendance,
  fee: Fee,
  notice: Notice,
};

const REPOSITORY_BUILDERS = {
  student: (model) => new StudentRepository(model),
};

class RepositoryFactory {
  static create(entityName) {
    const normalizedName = String(entityName || '').toLowerCase();
    const model = MODEL_REGISTRY[normalizedName];

    if (!model) {
      throw new Error(`RepositoryFactory: Unknown entity "${entityName}"`);
    }

    const buildRepository = REPOSITORY_BUILDERS[normalizedName];
    return buildRepository ? buildRepository(model) : new BaseRepository(model);
  }

  static createMany(entityNames = []) {
    return entityNames.reduce((repositories, entityName) => {
      repositories[entityName] = RepositoryFactory.create(entityName);
      return repositories;
    }, {});
  }
}

module.exports = RepositoryFactory;
