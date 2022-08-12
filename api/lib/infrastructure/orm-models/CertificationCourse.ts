// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Assessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CertificationChallenge');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./CertificationIssueReport');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./ComplementaryCertificationCourse');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('./Session');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'CertificationCourse';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'certification-courses',
    hasTimestamps: ['createdAt', 'updatedAt'],

    parse(rawAttributes: $TSFixMe) {
      if (rawAttributes.completedAt) {
        rawAttributes.completedAt = new Date(rawAttributes.completedAt);
      }

      return rawAttributes;
    },

    assessment() {
      return this.hasOne('Assessment', 'certificationCourseId');
    },

    challenges() {
      return this.hasMany('CertificationChallenge', 'courseId');
    },

    session() {
      return this.belongsTo('Session', 'sessionId');
    },

    certificationIssueReports() {
      return this.hasMany('CertificationIssueReport', 'certificationCourseId');
    },

    complementaryCertificationCourses() {
      return this.hasMany('ComplementaryCertificationCourse', 'certificationCourseId');
    },
  },
  {
    modelName,
  }
);
