// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, isNil, each } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SiecleXmlI... Remove this comment to see the full error message
const { SiecleXmlImportError } = require('../../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  INE_REQUIRED: 'INE_REQUIRED',
  INE_UNIQUE: 'INE_UNIQUE',
};
const DIVISION = 'D';

class XMLOrganizationLearnersSet {
  organizationLearnersByStudentId: $TSFixMe;
  studentIds: $TSFixMe;
  constructor() {
    this.organizationLearnersByStudentId = new Map();
    this.studentIds = [];
  }

  add(id: $TSFixMe, xmlNode: $TSFixMe) {
    const nationalStudentId = _getValueFromParsedElement(xmlNode.ID_NATIONAL);
    this._checkNationalStudentIdUniqueness(nationalStudentId);
    this.studentIds.push(nationalStudentId);

    this.organizationLearnersByStudentId.set(id, _mapStudentInformationToOrganizationLearner(xmlNode));
  }

  updateDivision(xmlNode: $TSFixMe) {
    const currentStudent = this.organizationLearnersByStudentId.get(xmlNode.STRUCTURES_ELEVE.$.ELEVE_ID);
    const structureElement = xmlNode.STRUCTURES_ELEVE.STRUCTURE;

    each(structureElement, (structure: $TSFixMe) => {
      if (structure.TYPE_STRUCTURE[0] === DIVISION && structure.CODE_STRUCTURE[0] !== 'Inactifs') {
        currentStudent.division = structure.CODE_STRUCTURE[0];
      }
    });
  }

  _checkNationalStudentIdUniqueness(nationalStudentId: $TSFixMe) {
    if (isEmpty(nationalStudentId)) {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      throw new SiecleXmlImportError((ERRORS as $TSFixMe).INE_REQUIRED);
    }
    if (this.studentIds.includes(nationalStudentId)) {
      throw new SiecleXmlImportError((ERRORS as $TSFixMe).INE_UNIQUE, { nationalStudentId });
    }
  }

  has(studentId: $TSFixMe) {
    return this.organizationLearnersByStudentId.has(studentId);
  }

  get organizationLearners() {
    return Array.from(this.organizationLearnersByStudentId.values());
  }
}

function _mapStudentInformationToOrganizationLearner(studentNode: $TSFixMe) {
  return {
    lastName: _getValueFromParsedElement(studentNode.NOM_DE_FAMILLE),
    preferredLastName: _getValueFromParsedElement(studentNode.NOM_USAGE),
    firstName: _getValueFromParsedElement(studentNode.PRENOM),
    middleName: _getValueFromParsedElement(studentNode.PRENOM2),
    thirdName: _getValueFromParsedElement(studentNode.PRENOM3),
    sex: _convertSexCode(studentNode.CODE_SEXE),
    birthdate: moment(studentNode.DATE_NAISS, 'DD/MM/YYYY').format('YYYY-MM-DD') || null,
    birthCountryCode: _getValueFromParsedElement(studentNode.CODE_PAYS),
    birthProvinceCode: _getValueFromParsedElement(studentNode.CODE_DEPARTEMENT_NAISS),
    birthCityCode: _getValueFromParsedElement(studentNode.CODE_COMMUNE_INSEE_NAISS),
    birthCity: _getValueFromParsedElement(studentNode.VILLE_NAISS),
    MEFCode: _getValueFromParsedElement(studentNode.CODE_MEF),
    status: _getValueFromParsedElement(studentNode.CODE_STATUT),
    nationalStudentId: _getValueFromParsedElement(studentNode.ID_NATIONAL),
  };
}

function _convertSexCode(obj: $TSFixMe) {
  const value = _getValueFromParsedElement(obj);
  if (value === '1') return 'M';
  if (value === '2') return 'F';
  return null;
}

function _getValueFromParsedElement(obj: $TSFixMe) {
  if (isNil(obj)) return null;
  return Array.isArray(obj) && !isEmpty(obj) ? obj[0] : obj;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = XMLOrganizationLearnersSet;
