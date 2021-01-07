const Joi = require('@hapi/joi');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('./CertificationIssueReportCategory');

module.exports = class CandidateInformationChangesCertificationIssueReport {
  constructor({
    id,
    certificationCourseId,
    subcategory,
    description,
  }) {
    this.id = id;
    this.certificationCourseId = certificationCourseId;
    this.category = CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES;
    this.subcategory = subcategory;
    this.description = description;
    Joi.assert(this, validationSchema);
  }
};

const validationSchema = Joi.object({
  id: Joi.number().integer().optional(),
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES),
  description: Joi.string().trim().required(),
  subcategory: Joi.string().required().valid(CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE, CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE),
});
