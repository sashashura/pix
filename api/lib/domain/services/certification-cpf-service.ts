// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
const { normalizeAndSortChars } = require('../../infrastructure/utils/string-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');

const CpfValidationStatus = {
  FAILURE: 'FAILURE',
  SUCCESS: 'SUCCESS',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
class CpfBirthInformationValidation {
  birthCity: $TSFixMe;
  birthCountry: $TSFixMe;
  birthINSEECode: $TSFixMe;
  birthPostalCode: $TSFixMe;
  message: $TSFixMe;
  status: $TSFixMe;
  constructor({
    message,
    status,
    birthCountry,
    birthINSEECode,
    birthPostalCode,
    birthCity
  }: $TSFixMe) {
    this.message = message;
    this.status = status;
    this.birthCountry = birthCountry;
    this.birthINSEECode = birthINSEECode;
    this.birthPostalCode = birthPostalCode;
    this.birthCity = birthCity;
  }

  static failure(message: $TSFixMe) {
    return new CpfBirthInformationValidation({ message, status: CpfValidationStatus.FAILURE });
  }

  static success({
    birthCountry,
    birthINSEECode,
    birthPostalCode,
    birthCity
  }: $TSFixMe) {
    return new CpfBirthInformationValidation({
      birthCountry,
      birthINSEECode,
      birthPostalCode,
      birthCity,
      status: CpfValidationStatus.SUCCESS,
    });
  }

  hasFailed() {
    return this.status === CpfValidationStatus.FAILURE;
  }
}

function getForeignCountryBirthInformation(birthCity: $TSFixMe, birthINSEECode: $TSFixMe, birthPostalCode: $TSFixMe, country: $TSFixMe) {
  if (!birthCity) {
    return CpfBirthInformationValidation.failure('Le champ ville est obligatoire.');
  }

  if (birthPostalCode) {
    return CpfBirthInformationValidation.failure(
      'Le champ code postal ne doit pas être renseigné pour un pays étranger.'
    );
  }

  if (!birthINSEECode || birthINSEECode !== '99') {
    return CpfBirthInformationValidation.failure('La valeur du code INSEE doit être "99" pour un pays étranger.');
  }

  return CpfBirthInformationValidation.success({
    birthCountry: country.commonName,
    birthINSEECode: country.code,
    birthPostalCode: null,
    birthCity,
  });
}

async function getBirthInformationByINSEECode(birthCity: $TSFixMe, birthINSEECode: $TSFixMe, country: $TSFixMe, certificationCpfCityRepository: $TSFixMe) {
  if (birthCity) {
    return CpfBirthInformationValidation.failure(
      "Le champ commune de naissance ne doit pas être renseigné lorsqu'un code INSEE est renseigné."
    );
  }

  const cities = await certificationCpfCityRepository.findByINSEECode({ INSEECode: birthINSEECode });

  if (isEmpty(cities)) {
    return CpfBirthInformationValidation.failure(`Le code INSEE "${birthINSEECode}" n'est pas valide.`);
  }

  return CpfBirthInformationValidation.success({
    birthCountry: country.commonName,
    birthINSEECode,
    birthPostalCode: null,
    birthCity: _getActualCity(cities),
  });
}

async function getBirthInformationByPostalCode(birthCity: $TSFixMe, birthPostalCode: $TSFixMe, country: $TSFixMe, certificationCpfCityRepository: $TSFixMe) {
  if (!birthCity) {
    return CpfBirthInformationValidation.failure('Le champ ville est obligatoire.');
  }

  const cities = await certificationCpfCityRepository.findByPostalCode({ postalCode: birthPostalCode });

  if (isEmpty(cities)) {
    return CpfBirthInformationValidation.failure(`Le code postal "${birthPostalCode}" n'est pas valide.`);
  }

  const normalizedAndSortedCity = normalizeAndSortChars(birthCity);
  const matchedCity = cities.find((city: $TSFixMe) => normalizeAndSortChars(city.name) === normalizedAndSortedCity);

  if (!matchedCity) {
    return CpfBirthInformationValidation.failure(
      `Le code postal "${birthPostalCode}" ne correspond pas à la ville "${birthCity}"`
    );
  }

  return CpfBirthInformationValidation.success({
    birthCountry: country.commonName,
    birthINSEECode: null,
    birthPostalCode,
    birthCity: matchedCity.name,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getBirthIn... Remove this comment to see the full error message
async function getBirthInformation({
  birthCountry,
  birthCity,
  birthPostalCode,
  birthINSEECode,
  certificationCpfCountryRepository,
  certificationCpfCityRepository
}: $TSFixMe) {
  if (!birthCountry) {
    return CpfBirthInformationValidation.failure('Le champ pays est obligatoire.');
  }

  const matcher = normalizeAndSortChars(birthCountry);
  const country = await certificationCpfCountryRepository.getByMatcher({ matcher });

  if (!country) {
    return CpfBirthInformationValidation.failure(`Le pays "${birthCountry}" n'a pas été trouvé.`);
  }
  if (country.isForeign()) {
    return getForeignCountryBirthInformation(birthCity, birthINSEECode, birthPostalCode, country);
  } else {
    if (!birthINSEECode && !birthPostalCode) {
      return CpfBirthInformationValidation.failure('Le champ code postal ou code INSEE doit être renseigné.');
    }

    if (birthINSEECode && birthPostalCode) {
      return CpfBirthInformationValidation.failure(
        'Seul l\'un des champs "Code postal" ou "Code Insee" doit être renseigné.'
      );
    }

    if (birthINSEECode) {
      return await getBirthInformationByINSEECode(birthCity, birthINSEECode, country, certificationCpfCityRepository);
    }

    if (birthPostalCode) {
      return await getBirthInformationByPostalCode(birthCity, birthPostalCode, country, certificationCpfCityRepository);
    }
  }
}

function _getActualCity(cities: $TSFixMe) {
  const actualCity = cities.find((city: $TSFixMe) => city.isActualName);
  return actualCity.name;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getBirthInformation,
  CpfBirthInformationValidation,
};
