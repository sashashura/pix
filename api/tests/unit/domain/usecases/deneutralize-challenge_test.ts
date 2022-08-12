// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessment = require('../../../../lib/domain/models/CertificationAssessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deneutralizeChallenge = require('../../../../lib/domain/usecases/deneutralize-challenge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('../../../../lib/domain/events/ChallengeDeneutralized');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | deneutralize-challenge', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('deneutralizes a challenge by its recId', async function () {
    // given
    const certificationCourseId = 1;
    const certificationAssessmentRepository = {
      getByCertificationCourseId: sinon.stub(),
      save: sinon.stub(),
    };
    const dependencies = {
      certificationAssessmentRepository,
    };

    const challengeToBeDeneutralized = domainBuilder.buildCertificationChallengeWithType({ isNeutralized: true });
    const certificationAssessment = domainBuilder.buildCertificationAssessment({
      certificationChallenges: [
        challengeToBeDeneutralized,
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
      ],
    });
    sinon.stub(certificationAssessment, 'deneutralizeChallengeByRecId');

    certificationAssessmentRepository.getByCertificationCourseId
      .withArgs({ certificationCourseId })
      .resolves(certificationAssessment);

    // when
    await deneutralizeChallenge({
      ...dependencies,
      certificationCourseId,
      challengeRecId: challengeToBeDeneutralized.challengeId,
      juryId: 7,
    });

    // then
    expect(certificationAssessment.deneutralizeChallengeByRecId).to.have.been.calledWith(
      challengeToBeDeneutralized.challengeId
    );
    expect(certificationAssessmentRepository.save).to.have.been.calledWith(certificationAssessment);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('return a ChallengeDeneutralized event', async function () {
    // given
    const certificationCourseId = 1;
    const certificationAssessmentRepository = {
      getByCertificationCourseId: sinon.stub(),
      save: sinon.stub(),
    };
    const dependencies = {
      certificationAssessmentRepository,
    };

    const challengeToBeDeneutralized = domainBuilder.buildCertificationChallengeWithType({ isNeutralized: true });
    const certificationAssessment = new CertificationAssessment({
      id: 123,
      userId: 123,
      certificationCourseId: 1,
      createdAt: new Date('2020-01-01'),
      completedAt: new Date('2020-01-01'),
      state: CertificationAssessment.states.STARTED,
      isV2Certification: true,
      certificationChallenges: [
        challengeToBeDeneutralized,
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
      ],
      certificationAnswersByDate: ['answer'],
    });
    certificationAssessmentRepository.getByCertificationCourseId
      .withArgs({ certificationCourseId })
      .resolves(certificationAssessment);

    // when
    const event = await deneutralizeChallenge({
      ...dependencies,
      certificationCourseId,
      challengeRecId: challengeToBeDeneutralized.challengeId,
      juryId: 7,
    });

    // then
    expect(event).to.be.an.instanceof(ChallengeDeneutralized);
    expect(event).to.deep.equal({ certificationCourseId, juryId: 7 });
  });
});
