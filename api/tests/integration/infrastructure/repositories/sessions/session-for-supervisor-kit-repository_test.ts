// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionForSupervisorKitRepository = require('../../../../../lib/infrastructure/repositories/sessions/session-for-supervisor-kit-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervisorKit = require('../../../../../lib/domain/read-models/SessionForSupervisorKit');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Session-for-supervisor-kit', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return session main information', async function () {
        // given
        databaseBuilder.factory.buildOrganization({ externalId: 'EXT1234', isManagingStudents: true });
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter({
          name: 'Tour Gamma',
          type: 'SCO',
          externalId: 'EXT1234',
        });

        const session = databaseBuilder.factory.buildSession({
          id: 1234,
          certificationCenter: 'Tour Gamma',
          certificationCenterId: certificationCenter.id,
          address: 'rue de Bercy',
          room: 'Salle A',
          examiner: 'Monsieur Examinateur',
          date: '2018-02-23',
          time: '12:00:00',
          accessCode: 'X23SR71',
          supervisorPassword: 'NYX34',
        });

        await databaseBuilder.commit();

        const expectedSessionValues = new SessionForSupervisorKit({
          id: 1234,
          certificationCenterName: 'Tour Gamma',
          address: 'rue de Bercy',
          room: 'Salle A',
          examiner: 'Monsieur Examinateur',
          date: '2018-02-23',
          time: '12:00:00',
          accessCode: 'X23SR71',
          supervisorPassword: 'NYX34',
        });

        // when
        const actualSession = await sessionForSupervisorKitRepository.get(session.id);

        // then
        expect(actualSession).to.deepEqualInstance(expectedSessionValues);
      });
    });
  });
});
