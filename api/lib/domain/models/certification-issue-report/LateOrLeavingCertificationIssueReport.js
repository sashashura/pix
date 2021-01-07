const Joi = require('@hapi/joi');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('./CertificationIssueReportCategory');

module.exports = class LateOrLeavingCertificationIssueReport {
  constructor({
    id,
    certificationCourseId,
    subcategory,
    description,
  }) {
    this.id = id;
    this.certificationCourseId = certificationCourseId;
    this.category = CertificationIssueReportCategories.LATE_OR_LEAVING;
    this.subcategory = subcategory;
    this.description = description;
    Joi.assert(this, validationSchema);
  }
};

const validationSchema = Joi.object({
  id: Joi.number().integer().optional(),
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.LATE_OR_LEAVING),
  description: Joi.string().trim().required(),
  subcategory: Joi.string().required().valid(CertificationIssueReportSubcategories.LEFT_EXAM_ROOM, CertificationIssueReportSubcategories.SIGNATURE_ISSUE),
});
