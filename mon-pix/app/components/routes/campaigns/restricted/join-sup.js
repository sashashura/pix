import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { standardizeNumberInTwoDigitFormat } from 'mon-pix/utils/standardize-number';

const ERROR_INPUT_MESSAGE_MAP = {
  studentNumber: 'Votre numéro étudiant n’est pas renseigné.',
  firstName: 'Votre prénom n’est pas renseigné.',
  lastName: 'Votre nom n’est pas renseigné.',
  dayOfBirth: 'Votre jour de naissance n’est pas valide.',
  monthOfBirth: 'Votre mois de naissance n’est pas valide.',
  yearOfBirth: 'Votre année de naissance n’est pas valide.',
};

const isDayValid = (value) => value > 0 && value <= 31;
const isMonthValid = (value) => value > 0 && value <= 12;
const isYearValid = (value) => value > 999 && value <= 9999;
const isStringValid = (value) => !!value.trim();

class Validation {
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked dayOfBirth = null;
  @tracked monthOfBirth = null;
  @tracked yearOfBirth = null;
  @tracked studentNumber = null;
}

export default class JoinSup extends Component {
  @service store;
  @tracked errorForQuickFormMessage;
  @tracked errorForFurtherInformationMessage;
  @tracked isLoading = false;
  @tracked showFurtherInformationForm = false;
  @tracked noStudentNumber = false;

  @tracked firstName = '';
  @tracked lastName = '';
  @tracked dayOfBirth = '';
  @tracked monthOfBirth = '';
  @tracked yearOfBirth = '';
  @tracked studentNumber = '';

  validation = new Validation();

  get birthdate() {
    const dayOfBirth = standardizeNumberInTwoDigitFormat(this.dayOfBirth.trim());
    const monthOfBirth = standardizeNumberInTwoDigitFormat(this.monthOfBirth.trim());
    const yearOfBirth = this.yearOfBirth.trim();
    return [yearOfBirth, monthOfBirth, dayOfBirth].join('-');
  }

  @action
  triggerInputStringValidation(key, value) {
    this._validateInputString(key, value);
  }

  @action
  triggerInputDayValidation(key, value) {
    value = value.trim();
    this._standardizeNumberInInput('dayOfBirth', value);
    this._validateInputDay(key, value);
  }

  @action
  triggerInputMonthValidation(key, value) {
    value = value.trim();
    this._standardizeNumberInInput('monthOfBirth', value);
    this._validateInputMonth(key, value);
  }

  @action
  triggerInputYearValidation(key, value) {
    value = value.trim();
    this.yearOfBirth = value;
    this._validateInputYear(key, value);
  }

  @action
  async attemptNext(event) {
    event.preventDefault();
    this.isLoading = true;
    let schoolingRegistration;
    const adapterOptions = {};
    if (this.showFurtherInformationForm) {
      this._validateInputString('firstName', this.firstName);
      this._validateInputString('lastName', this.lastName);
      this._validateInputDay('dayOfBirth', this.dayOfBirth);
      this._validateInputMonth('monthOfBirth', this.monthOfBirth);
      this._validateInputYear('yearOfBirth', this.yearOfBirth);
      if (this.validation.firstName || this.validation.lastName || this.validation.dayOfBirth || this.validation.monthOfBirth || this.validation.yearOfBirth) {
        return this.isLoading = false;
      }

      schoolingRegistration = this.store.createRecord('schooling-registration-user-association', {
        id: this.args.campaignCode + '_' + this.lastName,
        studentNumber: this.noStudentNumber ? null : this.studentNumber,
        firstName: this.firstName,
        lastName: this.lastName,
        birthdate: this.birthdate,
        campaignCode: this.args.campaignCode,
      });
      adapterOptions.registerAdditional = true;
    } else {
      this._validateInputString('studentNumber', this.studentNumber);
      if (this.validation.studentNumber) {
        return this.isLoading = false;
      }
      schoolingRegistration = this.store.createRecord('schooling-registration-user-association', {
        id: this.args.campaignCode + '_' + this.studentNumber,
        studentNumber: this.studentNumber,
        campaignCode: this.args.campaignCode,
      });
    }

    try {
      await this.args.onSubmit(schoolingRegistration, adapterOptions);
      this.isLoading = false;
    } catch (errorResponse) {
      schoolingRegistration.unloadRecord();
      this._setErrorMessageForAttemptNextAction(errorResponse);
      this.isLoading = false;
    }
  }

  @action
  hideFurtherInformationForm() {
    this.showFurtherInformationForm = false;
    this.noStudentNumber = false;
    this.errorForQuickFormMessage = null;
    this.errorForFurtherInformationMessage = null;
    this.firstName = '';
    this.lastName = '';
    this.dayOfBirth = '';
    this.monthOfBirth = '';
    this.yearOfBirth = '';
  }

  @action
  toggleNoStudentNumber() {
    this.studentNumber = null;
    this.noStudentNumber = !this.noStudentNumber;
    this.showFurtherInformationForm = !this.showFurtherInformationForm;
    this.errorForQuickFormMessage = null;
    this.errorForFurtherInformationMessage = null;
  }

  _setErrorMessageForAttemptNextAction(errorResponse) {
    errorResponse.errors.forEach((error) => {
      const messageFor409 = 'Vous possédez déjà un compte Pix. Pour continuer, connectez-vous à ce compte ou demandez de l’aide à un enseignant.';
      if (this.showFurtherInformationForm && error.status === '409') {
        return this.errorForFurtherInformationMessage = messageFor409;
      }
      if (error.status === '409') {
        return this.errorForQuickFormMessage = messageFor409;
      }
      if (error.status === '404') {
        this.showFurtherInformationForm = true;
        return this.errorForQuickFormMessage = 'Vérifiez votre numéro étudiant ou saisissez les informations ci-dessous.';
      }
      return this.errorMessage = error.detail;
    });
  }

  _standardizeNumberInInput(attribute, value) {
    if (value) {
      this.attribute = standardizeNumberInTwoDigitFormat(value);
    }
  }

  _executeFieldValidation(key, value, isValid) {
    const isInvalidInput = !isValid(value);
    const message = isInvalidInput ? ERROR_INPUT_MESSAGE_MAP[key] : null;
    this.validation[key] = message;
  }

  _validateInputString(key, value) {
    this._executeFieldValidation(key, value, isStringValid);
  }

  _validateInputDay(key, value) {
    this._executeFieldValidation(key, value, isDayValid);
  }

  _validateInputMonth(key, value) {
    this._executeFieldValidation(key, value, isMonthValid);
  }

  _validateInputYear(key, value) {
    this._executeFieldValidation(key, value, isYearValid);
  }
}

