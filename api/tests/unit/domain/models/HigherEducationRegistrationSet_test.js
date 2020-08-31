const _ = require('lodash');
const HigherEducationRegistrationSet = require('../../../../lib/domain/models/HigherEducationRegistrationSet');
const { expect, catchErr } = require('../../../test-helper');
const {  EntityValidationError } = require('../../../../lib/domain/errors');

describe('Unit | Domain | Models | HigherEducationRegistrationSet', () => {

  context('#addRegistration', () => {
    context('when set has no registration', () => {
      it('creates the first registration of the set', () => {

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registrationAttributes = {
          firstName: 'Beatrix',
          middleName: 'The',
          thirdName: 'Bride',
          lastName: 'Kiddo',
          preferredLastName: 'Black Mamba',
          studentNumber: '1',
          email: 'thebride@example.net',
          birthdate: new Date('1980-07-01'),
          diploma: 'Master',
          department: 'Assassination Squad',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'I have no idea what it\'s like.',
          organizationId: 1,
          isSupernumerary: false
        };

        higherEducationRegistrationSet.addRegistration(registrationAttributes);
        const registrations = higherEducationRegistrationSet.registrations;

        expect(registrations).to.have.lengthOf(1);
        expect(registrations[0]).to.deep.equal(registrationAttributes);
      });
    });

    context('when set has registrations', () => {
      it('creates the a new registration for the set', () => {

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Beatrix',
          middleName: 'The',
          thirdName: 'Bride',
          lastName: 'Kiddo',
          preferredLastName: 'Black Mamba',
          studentNumber: '1',
          email: 'thebride@example.net',
          birthdate: new Date('1980-07-01'),
          diploma: 'Master',
          department: 'Assassination Squad',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'I have no idea what it\'s like.',
          userId: 12345,
          organizationId: 1,
          isSupernumerary: false
        };
        const registration2 = {
          firstName: 'Bill',
          middleName: 'Unknown',
          thirdName: 'Unknown',
          lastName: 'Unknown',
          preferredLastName: 'Snake Charmer',
          studentNumber: '2',
          email: 'bill@example.net',
          birthdate: new Date('1960-07-01'),
          diploma: 'Doctorat',
          department: 'Assassination Squad Management',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'I have always no idea what it\'s like.',
          organizationId: 2,
          isSupernumerary: false
        };

        higherEducationRegistrationSet.addRegistration(registration1);
        higherEducationRegistrationSet.addRegistration(registration2);
        const registrations = higherEducationRegistrationSet.registrations;

        expect(registrations).to.have.lengthOf(2);
        expect(registrations[1]).to.deep.equal(registration2);
      });
    });

    context('when a registration is not valid', () => {
      it('throws an error', async () => {

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration = {
          firstName: null,
          lastName: 'Kiddo',
          birthdate: new Date('1980-07-01'),
        };

        const addRegistration = higherEducationRegistrationSet.addRegistration.bind(higherEducationRegistrationSet);
        const error = await catchErr(addRegistration)(registration);

        expect(error).to.be.instanceOf(EntityValidationError);
      });
    });

    context('when there is a registration with the same student number', () => {
      it('throws an error', async () => {

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Beatrix',
          lastName: 'Kiddo',
          birthdate: new Date('1980-07-01'),
          studentNumber: 1
        };
        const registration2 = {
          firstName: 'Ishii',
          lastName: 'O-ren',
          birthdate: new Date('1990-01-01'),
          studentNumber: 1
        };

        const addRegistration = higherEducationRegistrationSet.addRegistration.bind(higherEducationRegistrationSet);
        await catchErr(addRegistration)(registration1);
        const error = await catchErr(addRegistration)(registration2);

        expect(error).to.be.instanceOf(EntityValidationError);
      });
    });
  });

  context('#identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber', () => {
    const existingSupernumerary = {
      id: 123,
      firstName: 'Laura',
      lastName: 'Laplubelle',
      birthdate: '2010-04-01',
    };
    const anotherSupernumerary = {
      id: 789,
      firstName: 'Estelle',
      lastName: 'Unpoilmoinsbellequelaura',
      birthdate: '2009-01-01',
    };
    const existingSupernumeraries = [anotherSupernumerary, existingSupernumerary];

    context('no match found', () => {

      it('should return an empty array', async () => {
        // given
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Arthur',
          lastName: 'Leplublo',
          birthdate: '2010-05-02',
          organizationId: 1,
          studentNumber: '456DEF',
        };
        higherEducationRegistrationSet.addRegistration(registration1);

        // when
        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingSupernumeraries);

        // then
        expect(higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate).to.be.empty;
      });
    });

    context('a match is found based on firstName, lastName and birthdate', () => {

      it('should return the registration updated with info from set', async () => {
        // given
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123ABC',
        };
        higherEducationRegistrationSet.addRegistration(registration1);

        // when
        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingSupernumeraries);

        // then
        const registrationToUpdate = higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate[0];
        expect(_.pick(registrationToUpdate, ['id', 'firstName', 'lastName', 'birthdate', 'organizationId', 'studentNumber'])).to.deep.equal({
          ...registration1,
          id: existingSupernumerary.id,
        });
      });
    });

    context('when the birthdate and lastName match and the firstName match using the levenshtein distance', () => {

      it('should return the registration updated with info from set', async () => {
        // given
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Laure',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123ABC',
        };
        higherEducationRegistrationSet.addRegistration(registration1);

        // when
        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingSupernumeraries);

        // then
        const registrationsToUpdate = higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate[0];

        expect(_.pick(registrationsToUpdate, ['id', 'firstName', 'lastName', 'birthdate', 'organizationId', 'studentNumber'])).to.deep.equal({
          ...registration1,
          id: existingSupernumerary.id,
        });
      });
    });

    context('when the birthdate match and the lastName match using the levenshtein distance', () => {
      it('should return the registration updated with info from set', async () => {
        // given
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Laura',
          lastName: 'Laplubelleu',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123ABC',
        };
        higherEducationRegistrationSet.addRegistration(registration1);

        // when
        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingSupernumeraries);

        // then
        const registrationsToUpdate = higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate[0];
        expect(_.pick(registrationsToUpdate, ['id', 'firstName', 'lastName', 'birthdate', 'organizationId', 'studentNumber'])).to.deep.equal({
          ...registration1,
          id: existingSupernumerary.id,
        });
      });
    });

    context('when several supernumeraries match the same registration', () => {

      it('should not include those matches in the supernumeraryRegistrationsToUpdate', async () => {
        // given
        const anotherExistingSupernumerary = {
          id: 789,
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
        };
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123ABC',
        };
        higherEducationRegistrationSet.addRegistration(registration1);

        // when
        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber([...existingSupernumeraries, anotherExistingSupernumerary]);

        // then
        expect(higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate).to.be.empty;
      });

      it('should take into account successive calls to identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber', async () => {
        // given
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123ABC',
        };
        higherEducationRegistrationSet.addRegistration(registration1);

        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingSupernumeraries);
        const registrationToUpdate = higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate[0];
        expect(_.pick(registrationToUpdate, ['id', 'firstName', 'lastName', 'birthdate', 'organizationId', 'studentNumber'])).to.deep.equal({
          ...registration1,
          id: existingSupernumerary.id,
        });

        const anotherExistingSupernumerary = {
          id: 789,
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
        };
        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber([anotherExistingSupernumerary]);
        expect(higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate).to.be.empty;
      });
    });

    context('when one supernumerary matches several registrations', () => {

      it('should take into account successive calls to identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber', async () => {
        // given
        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123ABC',
        };
        const registration2 = {
          firstName: 'Laura',
          lastName: 'Laplubelle',
          birthdate: '2010-04-01',
          organizationId: 1,
          studentNumber: '123DEF',
        };
        higherEducationRegistrationSet.addRegistration(registration1);
        higherEducationRegistrationSet.addRegistration(registration2);

        higherEducationRegistrationSet.identifyMatchesBetweenRegistrationsAndExistingRegistrationsWithoutStudentNumber(existingSupernumeraries);

        expect(higherEducationRegistrationSet.supernumeraryRegistrationsToUpdate).to.be.empty;
      });
    });

  });
});
