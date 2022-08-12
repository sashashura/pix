// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
  InvalidCertificationIssueReportForSaving,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Deprecated... Remove this comment to see the full error message
  DeprecatedCertificationIssueReportCategoryError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Deprecated... Remove this comment to see the full error message
  DeprecatedCertificationIssueReportSubcategoryError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./CertificationIssueReportCategory');

const categoryNonBlockingTechnicalIssueJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.NON_BLOCKING_TECHNICAL_ISSUE),
  description: Joi.string().trim().required(),
});

const categoryNonBlockingCandidateIssueJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.NON_BLOCKING_CANDIDATE_ISSUE),
  description: Joi.string().trim().required(),
});

const categoryLateOrLeavingJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.LATE_OR_LEAVING),
  description: Joi.string().when('subcategory', {
    switch: [
      { is: Joi.valid(CertificationIssueReportSubcategories.LEFT_EXAM_ROOM), then: Joi.string().trim().required() },
    ],
    otherwise: Joi.string().trim().optional(),
  }),
  subcategory: Joi.string()
    .required()
    .valid(CertificationIssueReportSubcategories.LEFT_EXAM_ROOM, CertificationIssueReportSubcategories.SIGNATURE_ISSUE),
});

const categoryCandidateInformationChangesJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES),
  description: Joi.string().trim().required(),
  subcategory: Joi.string()
    .required()
    .valid(
      CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
      CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE
    ),
});

const categoryInChallengeJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.IN_CHALLENGE),
  questionNumber: Joi.number().min(1).max(500).required(),
  subcategory: Joi.string()
    .required()
    .valid(
      CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
      CertificationIssueReportSubcategories.LINK_NOT_WORKING,
      CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
      CertificationIssueReportSubcategories.FILE_NOT_OPENING,
      CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
      CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
      CertificationIssueReportSubcategories.OTHER,
      CertificationIssueReportSubcategories.EXTRA_TIME_EXCEEDED,
      CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING,
      CertificationIssueReportSubcategories.UNINTENTIONAL_FOCUS_OUT,
      CertificationIssueReportSubcategories.SKIP_ON_OOPS,
      CertificationIssueReportSubcategories.ACCESSIBILITY_ISSUE
    ),
});

const categoryFraudJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.FRAUD),
});

const categoryTechnicalProblemJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.TECHNICAL_PROBLEM),
  description: Joi.string().trim().required(),
});

const categorySchemas = {
  [CertificationIssueReportCategories.LATE_OR_LEAVING]: categoryLateOrLeavingJoiSchema,
  [CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES]: categoryCandidateInformationChangesJoiSchema,
  [CertificationIssueReportCategories.IN_CHALLENGE]: categoryInChallengeJoiSchema,
  [CertificationIssueReportCategories.FRAUD]: categoryFraudJoiSchema,
  [CertificationIssueReportCategories.NON_BLOCKING_CANDIDATE_ISSUE]: categoryNonBlockingCandidateIssueJoiSchema,
  [CertificationIssueReportCategories.NON_BLOCKING_TECHNICAL_ISSUE]: categoryNonBlockingTechnicalIssueJoiSchema,
  [CertificationIssueReportCategories.TECHNICAL_PROBLEM]: categoryTechnicalProblemJoiSchema,
};

const categoryCodeImpactful = [
  CertificationIssueReportCategories.TECHNICAL_PROBLEM,
  CertificationIssueReportCategories.OTHER,
  CertificationIssueReportCategories.FRAUD,
];

const subcategoryCodeImpactful = [
  CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
  CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
  CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
  CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
  CertificationIssueReportSubcategories.FILE_NOT_OPENING,
  CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
  CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
  CertificationIssueReportSubcategories.LINK_NOT_WORKING,
  CertificationIssueReportSubcategories.OTHER,
  CertificationIssueReportSubcategories.EXTRA_TIME_EXCEEDED,
  CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING,
  CertificationIssueReportSubcategories.UNINTENTIONAL_FOCUS_OUT,
  CertificationIssueReportSubcategories.SKIP_ON_OOPS,
  CertificationIssueReportSubcategories.ACCESSIBILITY_ISSUE,
];

const deprecatedSubcategories = [
  CertificationIssueReportSubcategories.LINK_NOT_WORKING,
  CertificationIssueReportSubcategories.OTHER,
];

const deprecatedCategories = [
  CertificationIssueReportCategories.TECHNICAL_PROBLEM,
  CertificationIssueReportCategories.OTHER,
];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationIssueReport {
  category: $TSFixMe;
  certificationCourseId: $TSFixMe;
  description: $TSFixMe;
  hasBeenAutomaticallyResolved: $TSFixMe;
  id: $TSFixMe;
  isImpactful: $TSFixMe;
  questionNumber: $TSFixMe;
  resolution: $TSFixMe;
  resolvedAt: $TSFixMe;
  subcategory: $TSFixMe;
  constructor({
    id,
    certificationCourseId,
    category,
    description,
    subcategory,
    questionNumber,
    hasBeenAutomaticallyResolved,
    resolvedAt,
    resolution
  }: $TSFixMe = {}) {
    this.id = id;
    this.certificationCourseId = certificationCourseId;
    this.category = category;
    this.subcategory = subcategory;
    this.description = description;
    this.questionNumber = questionNumber;
    this.hasBeenAutomaticallyResolved = hasBeenAutomaticallyResolved;
    this.resolvedAt = resolvedAt;
    this.resolution = resolution;
    this.isImpactful = _isImpactful({ category, subcategory });

    if (
      [
        CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN,
        CertificationIssueReportCategories.NON_BLOCKING_CANDIDATE_ISSUE,
        CertificationIssueReportCategories.NON_BLOCKING_TECHNICAL_ISSUE,
      ].includes(this.category)
    ) {
      this.subcategory = null;
    }

    if (this.category === CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN) {
      this.description = null;
    }

    if (this.category !== CertificationIssueReportCategories.IN_CHALLENGE) {
      this.questionNumber = null;
    }
  }

  static create({
    id,
    certificationCourseId,
    category,
    description,
    subcategory,
    questionNumber
  }: $TSFixMe) {
    const certificationIssueReport = new CertificationIssueReport({
      id,
      certificationCourseId,
      category,
      description,
      subcategory,
      questionNumber,
      hasBeenAutomaticallyResolved: null,
      resolvedAt: null,
      resolution: null,
    });
    certificationIssueReport.validate();
    return certificationIssueReport;
  }

  validate() {
    const schemaToUse = categorySchemas[this.category];
    if (!schemaToUse) {
      throw new InvalidCertificationIssueReportForSaving(`Unknown category : ${this.category}`);
    }

    const { error } = schemaToUse.validate(this, { allowUnknown: true });
    if (error) {
      throw new InvalidCertificationIssueReportForSaving(error);
    }

    if (_isCategoryDeprecated(this.category)) {
      throw new DeprecatedCertificationIssueReportCategoryError();
    }

    if (_isSubcategoryDeprecated(this.subcategory)) {
      throw new DeprecatedCertificationIssueReportSubcategoryError();
    }
  }

  isResolved() {
    return Boolean(this.resolvedAt);
  }

  resolveManually(resolution: $TSFixMe) {
    this.resolvedAt = new Date();
    this.resolution = resolution;
    this.hasBeenAutomaticallyResolved = false;
  }

  resolveAutomatically(resolution: $TSFixMe) {
    this.resolvedAt = new Date();
    this.resolution = resolution;
    this.hasBeenAutomaticallyResolved = true;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationIssueReport;

function _isImpactful({
  category,
  subcategory
}: $TSFixMe) {
  return categoryCodeImpactful.includes(category) || subcategoryCodeImpactful.includes(subcategory);
}

function _isCategoryDeprecated(category: $TSFixMe) {
  return deprecatedCategories.includes(category);
}

function _isSubcategoryDeprecated(subcategory: $TSFixMe) {
  return deprecatedSubcategories.includes(subcategory);
}
