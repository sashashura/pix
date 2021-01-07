const Joi = require('@hapi/joi');
const { CertificationIssueReportCategories } = require('./CertificationIssueReportCategory');

module.exports = class OtherCertificationIssueReport {
  constructor({
    id,
    certificationCourseId,
  }) {
    this.id = id;
    this.certificationCourseId = certificationCourseId;
    this.category = CertificationIssueReportCategories.OTHER;
    Joi.assert(this, validationSchema);
  }
};

const validationSchema = Joi.object({
  id: Joi.number().integer().optional(),
  certificationCourseId: Joi.number().integer().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.OTHER),
});
