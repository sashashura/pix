// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Assessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./KnowledgeElement');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Membership');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./PixAdminRole');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CertificationCenterMembership');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./UserOrgaSettings');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./OrganizationLearner');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./AuthenticationMethod');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'User';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'users',
    hasTimestamps: ['createdAt', 'updatedAt'],

    assessments() {
      return this.hasMany('Assessment', 'userId');
    },

    knowledgeElements() {
      return this.hasMany('KnowledgeElement', 'userId');
    },

    memberships() {
      return this.hasMany('Membership', 'userId');
    },

    certificationCenterMemberships() {
      return this.hasMany('CertificationCenterMembership', 'userId');
    },

    userOrgaSettings() {
      return this.hasOne('UserOrgaSettings', 'userId', 'id');
    },

    organizationLearners() {
      return this.hasMany('OrganizationLearner', 'userId');
    },

    authenticationMethods() {
      return this.hasMany('AuthenticationMethod', 'userId');
    },
  },
  {
    modelName,
  }
);
