const Bookshelf = require('../bookshelf');

require('./membership');
require('./target-profile-share');
require('./schooling-registration');

const modelName = 'Organization';

module.exports = Bookshelf.model(modelName, {

  tableName: 'organizations',
  hasTimestamps: ['createdAt', 'updatedAt'],
  requireFetch: false,

  memberships() {
    return this.hasMany('Membership', 'organizationId');
  },

  targetProfileShares() {
    return this.hasMany('TargetProfileShare', 'organizationId');
  },

  schoolingRegistrations() {
    return this.hasMany('SchoolingRegistration', 'organizationId');
  }

}, {
  modelName
});
