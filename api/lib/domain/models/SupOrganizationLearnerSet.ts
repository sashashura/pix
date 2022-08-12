// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearner = require('./SupOrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkValid... Remove this comment to see the full error message
const { checkValidation } = require('../validators/sup-organization-learner-set-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areTwoStri... Remove this comment to see the full error message
const { areTwoStringsCloseEnough } = require('../services/string-comparison-service');

const RATIO = 0.25;

const STUDY_SCHEMES = [
  'csv-import-values.sup-organization-learner.study-schemes.initial-training',
  'csv-import-values.sup-organization-learner.study-schemes.training',
  'csv-import-values.sup-organization-learner.study-schemes.continuous-training',
  'csv-import-values.sup-organization-learner.study-schemes.other',
];

const DIPLOMAS = [
  'csv-import-values.sup-organization-learner.diplomas.license',
  'csv-import-values.sup-organization-learner.diplomas.master',
  'csv-import-values.sup-organization-learner.diplomas.doctorat',
  'csv-import-values.sup-organization-learner.diplomas.dnmade',
  'csv-import-values.sup-organization-learner.diplomas.dma ',
  'csv-import-values.sup-organization-learner.diplomas.bts',
  'csv-import-values.sup-organization-learner.diplomas.dut',
  'csv-import-values.sup-organization-learner.diplomas.dts',
  'csv-import-values.sup-organization-learner.diplomas.dcg ',
  'csv-import-values.sup-organization-learner.diplomas.deust',
  'csv-import-values.sup-organization-learner.diplomas.etat-controle',
  'csv-import-values.sup-organization-learner.diplomas.ingenieur',
  'csv-import-values.sup-organization-learner.diplomas.license-grade',
  'csv-import-values.sup-organization-learner.diplomas.master-grade',
  'csv-import-values.sup-organization-learner.diplomas.vise',
  'csv-import-values.sup-organization-learner.diplomas.classe-preparatoire',
  'csv-import-values.sup-organization-learner.diplomas.other',
];

const UNKNOWN = 'csv-import-values.sup-organization-learner.unknown';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
class SupOrganizationLearnerSet {
  i18n: $TSFixMe;
  learners: $TSFixMe;
  warnings: $TSFixMe;
  constructor(i18n: $TSFixMe) {
    this.i18n = i18n;
    this.learners = [];
    this.warnings = [];
  }

  addLearner(learnerAttributes: $TSFixMe) {
    const learner = new SupOrganizationLearner(learnerAttributes);
    this._checkStudyScheme(learner);
    this._checkDiploma(learner);
    const transformedLearner = this._transform(learner);
    this.learners.push(transformedLearner);

    checkValidation(this);
  }

  addWarning(studentNumber: $TSFixMe, field: $TSFixMe, value: $TSFixMe, code: $TSFixMe) {
    this.warnings.push({ studentNumber, field, value, code });
  }

  _checkStudyScheme(learner: $TSFixMe) {
    const { studentNumber, studyScheme } = learner;
    if (this._isValidI18nValue(STUDY_SCHEMES, studyScheme)) return;
    this.addWarning(studentNumber, 'study-scheme', learner.studyScheme, 'unknown');
    learner.studyScheme = this.i18n.__(UNKNOWN);
  }

  _checkDiploma(learner: $TSFixMe) {
    const { studentNumber, diploma } = learner;
    if (this._isValidI18nValue(DIPLOMAS, diploma)) return;
    this.addWarning(studentNumber, 'diploma', learner.diploma, 'unknown');
    learner.diploma = this.i18n.__(UNKNOWN);
  }

  _isValidI18nValue(keys: $TSFixMe, valueToCheck: $TSFixMe) {
    if (!valueToCheck) return false;
    return keys.some((key: $TSFixMe) => {
      const reference = this.i18n.__(key).toLowerCase();
      const input = valueToCheck.toLowerCase();
      return areTwoStringsCloseEnough(input, reference, RATIO);
    });
  }
  _transform(learner: $TSFixMe) {
    return {
      ...learner,
      group: learner.group?.trim().replace(/\s+/g, ' '),
    };
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SupOrganizationLearnerSet;
