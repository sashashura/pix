const { EntityValidationError } = require('../errors');

class TargetProfileForUpdate {
  constructor({ id, name, description, comment }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.comment = comment;
  }

  update({ name, description, comment }) {
    if (!name)
      throw new EntityValidationError({
        invalidAttributes: { attribute: 'name', message: 'The name can not be empty' },
      });
    this.name = name;
    this.description = description;
    this.comment = comment;
  }
}

module.exports = TargetProfileForUpdate;
