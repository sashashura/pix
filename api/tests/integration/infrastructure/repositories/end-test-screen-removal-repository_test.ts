// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
  isEndTestScreenRemovalEnabledBySessionId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
  isEndTestScreenRemovalEnabledByCandidateId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
  isEndTestScreenRemovalEnabledByCertificationCenterId,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEndTestS... Remove this comment to see the full error message
  isEndTestScreenRemovalEnabledForSomeCertificationCenter,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/infrastructure/repositories/end-test-screen-removal-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | EndTestScreenRemovalRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEndTestScreenRemovalEnabledBySessionId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('the given session does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        // given
        const sessionId = 0;

        // when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledBySessionId(sessionId);

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.false;
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('the given session does exist', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the certification center has not the supervisor access enabled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns false', async function () {
          // given
          const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
            isSupervisorAccessEnabled: false,
          }).id;
          const sessionId = databaseBuilder.factory.buildSession({
            certificationCenterId,
          }).id;
          await databaseBuilder.commit();

          // when
          const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledBySessionId(sessionId);

          // then
          expect(isEndTestScreenRemovalEnabled).to.be.false;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the certification center has the supervisor access enabled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns true', async function () {
          // given
          const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
            isSupervisorAccessEnabled: true,
          }).id;
          const sessionId = databaseBuilder.factory.buildSession({
            certificationCenterId,
          }).id;
          await databaseBuilder.commit();

          // when
          const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledBySessionId(sessionId);

          // then
          expect(isEndTestScreenRemovalEnabled).to.be.true;
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEndTestScreenRemovalEnabledByCandidatesId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('the given candidates does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        // given
        const candidateId = 0;

        // when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledByCandidateId(candidateId);

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.false;
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('the given candidate does exist', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center has not the supervisor access enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        // given
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: false,
        }).id;
        const sessionId = databaseBuilder.factory.buildSession({
          certificationCenterId,
        }).id;
        const candidateId = databaseBuilder.factory.buildCertificationCandidate({ sessionId }).id;

        await databaseBuilder.commit();

        // when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledByCandidateId(candidateId);

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center has the supervisor access enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', async function () {
        // given
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: true,
        }).id;
        const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
        const candidateId = databaseBuilder.factory.buildCertificationCandidate({ sessionId }).id;
        await databaseBuilder.commit();

        // when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledByCandidateId(candidateId);

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEndTestScreenRemovalEnabledByCertificationCenterId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center has the supervisor access enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', async function () {
        //given
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: true,
        }).id;
        await databaseBuilder.commit();

        //when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledByCertificationCenterId(
          certificationCenterId
        );

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification center has not the supervisor access enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        //given
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: false,
        }).id;
        await databaseBuilder.commit();

        //when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledByCertificationCenterId(
          certificationCenterId
        );

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.false;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isEndTestScreenRemovalEnabledForSomeCertificationCenter', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all the certification center are enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', async function () {
        //given
        databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: true,
        });
        databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: true,
        });
        await databaseBuilder.commit();

        //when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledForSomeCertificationCenter();

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when some certification center are enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', async function () {
        // given
        databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: true,
        });
        databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: false,
        });
        await databaseBuilder.commit();

        // when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledForSomeCertificationCenter();

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no certification center is enabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        // given
        databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: false,
        });
        databaseBuilder.factory.buildCertificationCenter({
          isSupervisorAccessEnabled: false,
        });
        await databaseBuilder.commit();

        // when
        const isEndTestScreenRemovalEnabled = await isEndTestScreenRemovalEnabledForSomeCertificationCenter();

        // then
        expect(isEndTestScreenRemovalEnabled).to.be.false;
      });
    });
  });
});
