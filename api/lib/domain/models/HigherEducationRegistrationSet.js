const _ = require('lodash');
const HigherEducationRegistration =  require('./HigherEducationRegistration');
const { checkValidation } = require('../validators/higher-education-registration-set-validator');
const { areTwoStringsCloseEnough } = require('../services/string-comparison-service');

const LEVENSTHEIN_RATIO = 0.25;

class HigherEducationRegistrationSet {

  constructor() {
    this.registrations = [];
    this.supernumeraryRegistrationsFound = [];
  }

  addRegistration(registrationAttributes) {
    const registration = new HigherEducationRegistration(registrationAttributes);
    this.registrations.push(registration);
    checkValidation(this);
  }

  identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingRegistrationsWithoutStudentNumber) {
    for (const existingRegistration of existingRegistrationsWithoutStudentNumber) {
      this._addMatchingRegistration(existingRegistration);
    }
  }

  get supernumeraryRegistrationsToUpdate() {
    const countByStudentNumber = _.countBy(this.supernumeraryRegistrationsFound, 'studentNumber');
    return this.supernumeraryRegistrationsFound.filter((supernumeraryRegistration) => {
      return countByStudentNumber[supernumeraryRegistration.studentNumber] === 1;
    });
  }

  _addMatchingRegistration(existingRegistration) {
    const matchingRegistrations = this._findMatchingRegistrations(existingRegistration);
    if (matchingRegistrations.length === 1) {
      this.supernumeraryRegistrationsFound.push({
        ...matchingRegistrations[0],
        id: existingRegistration.id,
      });
    }
  }

  _findMatchingRegistrations({ firstName, lastName, birthdate }) {
    return _.filter(this.registrations, (registration) => {
      return areTwoStringsCloseEnough(firstName, registration.firstName, LEVENSTHEIN_RATIO)
        && areTwoStringsCloseEnough(registration.lastName,lastName, LEVENSTHEIN_RATIO)
        && registration.birthdate === birthdate;
    });
  }
}

module.exports = HigherEducationRegistrationSet;
