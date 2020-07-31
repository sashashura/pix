const { expect, databaseBuilder, knex } = require('../../../test-helper');
const higherEducationRegistrationRepository = require('../../../../lib/infrastructure/repositories/higher-education-registration-repository');
const HigherEducationRegistrationSet = require('../../../../lib/domain/models/HigherEducationRegistrationSet');

describe('Integration | Infrastructure | Repository | higher-education-registration-repository', () => {

  describe('#saveSet', () => {
    afterEach(() => {
      return knex('schooling-registrations').delete();
    });

    context('when there is no schooling registration with the same student number', () => {
      it('save all the superior schooling registrations', async function() {

        const organization = databaseBuilder.factory.buildOrganization();
        await databaseBuilder.commit();

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration1 = {
          firstName: 'Elle',
          middleName: 'One',
          thirdName: 'Eyed',
          lastName: 'Driver',
          preferredLastName: 'California Mountain Snake',
          studentNumber: '3',
          email: 'driver@example.net',
          birthdate: '1975-07-01',
          diploma: 'BTS',
          department: 'Assassination Squad',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          studyScheme: 'I have no idea what it\'s like.'
        };
        const registration1Attributes = {
          organizationId: organization.id,
          firstName: 'Elle',
          middleName: 'One',
          thirdName: 'Eyed',
          lastName: 'Driver',
          preferredLastName: 'California Mountain Snake',
          studentNumber: '3',
          email: 'driver@example.net',
          birthdate: '1975-07-01',
          diploma: 'BTS',
          department: 'Assassination Squad',
          educationalTeam: 'Pai Mei',
          group: 'Deadly Viper Assassination Squad',
          status: 'I have no idea what it\'s like.'
        };
        const registration2 = {
          firstName: 'O-Ren',
          middleName: 'Unknown',
          thirdName: 'Unknown',
          lastName: 'Ishii',
          preferredLastName: 'Cottonmouth',
          studentNumber: '4',
          email: 'ishii@example.net',
          birthdate: '1990-07-01',
          diploma: 'DUT',
          department: 'The Crazy 88',
          educationalTeam: 'Bill',
          group: 'Tokyo Crime World',
          studyScheme: 'I have always no idea what it\'s like.'
        };
        const registration2Attributes = {
          organizationId: organization.id,
          firstName: 'O-Ren',
          middleName: 'Unknown',
          thirdName: 'Unknown',
          lastName: 'Ishii',
          preferredLastName: 'Cottonmouth',
          studentNumber: '4',
          email: 'ishii@example.net',
          birthdate: '1990-07-01',
          diploma: 'DUT',
          department: 'The Crazy 88',
          educationalTeam: 'Bill',
          group: 'Tokyo Crime World',
          status: 'I have always no idea what it\'s like.'
        };

        higherEducationRegistrationSet.addRegistration(registration1);
        higherEducationRegistrationSet.addRegistration(registration2);

        await higherEducationRegistrationRepository.saveSet(higherEducationRegistrationSet, organization.id);

        const higherEducationRegistrations = await knex('schooling-registrations').where({ organizationId: organization.id }).orderBy('firstName');
        expect(higherEducationRegistrations).to.have.lengthOf(2);
        expect(higherEducationRegistrations[0]).to.include(registration1Attributes);
        expect(higherEducationRegistrations[1]).to.include(registration2Attributes);
      });
    });

    context('when there is schooling registration with the same student number for the same organization', () =>  {
      it('does not add any schooling registrations', async function() {

        const organization = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildSchoolingRegistration({
          preferredLastName: 'Sidewinder',
          studentNumber: '12',
          organizationId: organization.id
        });

        await databaseBuilder.commit();

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration = {
          preferredLastName: 'California Mountain Snake',
          studentNumber: '12',
          firstName: 'Elle',
          lastName: 'Driver',
          birthdate: '2020-01-01',
        };

        higherEducationRegistrationSet.addRegistration(registration);

        await higherEducationRegistrationRepository.saveSet(higherEducationRegistrationSet, organization.id);
        const higherEducationRegistrations = await knex('schooling-registrations').where({ organizationId: organization.id });

        expect(higherEducationRegistrations).to.have.lengthOf(1);
        expect(higherEducationRegistrations[0].preferredLastName).to.equal(registration.preferredLastName);
      });
    });

    context('when there is schooling registration with the same student number for another organization', () => {
      it('add schooling registrations', async function() {

        const organization = databaseBuilder.factory.buildOrganization();
        const otherOrganization = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildSchoolingRegistration({
          preferredLastName: 'Sidewinder',
          studentNumber: '12',
          organizationId: otherOrganization.id,
        });

        await databaseBuilder.commit();

        const higherEducationRegistrationSet = new HigherEducationRegistrationSet();
        const registration = {
          firstName: 'firstName',
          lastName: 'lastName',
          birthdate: '2020-01-01',
          preferredLastName: 'Sidewinder',
          studentNumber: '12',
        };

        higherEducationRegistrationSet.addRegistration(registration);

        await higherEducationRegistrationRepository.saveSet(higherEducationRegistrationSet, organization.id);

        const higherEducationRegistrations = await knex('schooling-registrations').where({ preferredLastName: 'Sidewinder' });

        const organizationIds = higherEducationRegistrations.map(({ organizationId }) => organizationId);

        expect(organizationIds).to.exactlyContain([organization.id, otherOrganization.id]);
      });
    });
  });
});
