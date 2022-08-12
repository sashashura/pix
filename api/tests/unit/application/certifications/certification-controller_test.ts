// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationController = require('../../../../lib/application/certifications/certification-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAttestationPdf = require('../../../../lib/infrastructure/utils/pdf/certification-attestation-pdf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'events'.
const events = require('../../../../lib/domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
const ChallengeNeutralized = require('../../../../lib/domain/events/ChallengeNeutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('../../../../lib/domain/events/ChallengeDeneutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../../../lib/infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | certifications-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findUserCertifications', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized private certificates of the user', async function () {
      // given
      const userId = 1;
      const request = { auth: { credentials: { userId } } };
      const privateCertificate1 = domainBuilder.buildPrivateCertificate.validated({
        id: 123,
        firstName: 'Dorothé',
        lastName: '2Pac',
        birthdate: '2000-01-01',
        birthplace: 'Sin City',
        isPublished: true,
        date: new Date('2020-01-01T00:00:00Z'),
        deliveredAt: new Date('2021-01-01T00:00:00Z'),
        certificationCenter: 'Centre des choux de Bruxelles',
        pixScore: 456,
        commentForCandidate: 'Cette personne est impolie !',
        cleaCertificationResult: domainBuilder.buildCleaCertificationResult.acquired(),
        certifiedBadgeImages: [],
        verificationCode: 'P-SUPERCODE',
        maxReachableLevelOnCertificationDate: 6,
      });
      sinon.stub(usecases, 'findUserPrivateCertificates');
      usecases.findUserPrivateCertificates.withArgs({ userId }).resolves([privateCertificate1]);

      // when
      const response = await certificationController.findUserCertifications(request, hFake);

      // then
      expect(response).to.deep.equal({
        data: [
          {
            id: '123',
            type: 'certifications',
            attributes: {
              'first-name': 'Dorothé',
              'last-name': '2Pac',
              birthdate: '2000-01-01',
              birthplace: 'Sin City',
              'certification-center': 'Centre des choux de Bruxelles',
              date: new Date('2020-01-01T00:00:00Z'),
              'delivered-at': new Date('2021-01-01T00:00:00Z'),
              'is-published': true,
              'pix-score': 456,
              status: 'validated',
              'comment-for-candidate': 'Cette personne est impolie !',
              'clea-certification-status': 'acquired',
              'certified-badge-images': [],
              'verification-code': 'P-SUPERCODE',
              'max-reachable-level-on-certification-date': 6,
            },
            relationships: {
              'result-competence-tree': {
                data: null,
              },
            },
          },
        ],
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized private certificate given by id', async function () {
      // given
      const userId = 1;
      const certificationId = 2;
      const request = {
        auth: { credentials: { userId } },
        params: { id: certificationId },
      };
      const locale = 'fr-fr';
      sinon.stub(requestResponseUtils, 'extractLocaleFromRequest');

      const privateCertificate = domainBuilder.buildPrivateCertificate.validated({
        id: certificationId,
        firstName: 'Dorothé',
        lastName: '2Pac',
        birthdate: '2000-01-01',
        birthplace: 'Sin City',
        isPublished: true,
        date: new Date('2020-01-01T00:00:00Z'),
        deliveredAt: new Date('2021-01-01T00:00:00Z'),
        certificationCenter: 'Centre des choux de Bruxelles',
        pixScore: 456,
        commentForCandidate: 'Cette personne est impolie !',
        cleaCertificationResult: domainBuilder.buildCleaCertificationResult.acquired(),
        certifiedBadgeImages: [],
        verificationCode: 'P-SUPERCODE',
        maxReachableLevelOnCertificationDate: 6,
      });
      sinon.stub(usecases, 'getPrivateCertificate');
      usecases.getPrivateCertificate.withArgs({ userId, certificationId, locale }).resolves(privateCertificate);
      requestResponseUtils.extractLocaleFromRequest.withArgs(request).returns(locale);

      // when
      const response = await certificationController.getCertification(request, hFake);

      // then
      expect(response).to.deep.equal({
        data: {
          id: '2',
          type: 'certifications',
          attributes: {
            'first-name': 'Dorothé',
            'last-name': '2Pac',
            birthdate: '2000-01-01',
            birthplace: 'Sin City',
            'certification-center': 'Centre des choux de Bruxelles',
            date: new Date('2020-01-01T00:00:00Z'),
            'delivered-at': new Date('2021-01-01T00:00:00Z'),
            'is-published': true,
            'pix-score': 456,
            status: 'validated',
            'comment-for-candidate': 'Cette personne est impolie !',
            'clea-certification-status': 'acquired',
            'certified-badge-images': [],
            'verification-code': 'P-SUPERCODE',
            'max-reachable-level-on-certification-date': 6,
          },
          relationships: {
            'result-competence-tree': {
              data: null,
            },
          },
        },
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertificationByVerificationCode', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized shareable certificate given by verification code', async function () {
      // given
      const request = { payload: { verificationCode: 'P-123456BB' } };
      const locale = 'fr-fr';
      sinon.stub(requestResponseUtils, 'extractLocaleFromRequest');
      const shareableCertificate = domainBuilder.buildShareableCertificate({
        id: 123,
        firstName: 'Dorothé',
        lastName: '2Pac',
        birthdate: '2000-01-01',
        birthplace: 'Sin City',
        isPublished: true,
        date: new Date('2020-01-01T00:00:00Z'),
        deliveredAt: new Date('2021-01-01T00:00:00Z'),
        certificationCenter: 'Centre des choux de Bruxelles',
        pixScore: 456,
        cleaCertificationResult: domainBuilder.buildCleaCertificationResult.acquired(),
        certifiedBadgeImages: ['/img/1'],
        maxReachableLevelOnCertificationDate: 6,
      });
      sinon.stub(usecases, 'getShareableCertificate');
      usecases.getShareableCertificate
        .withArgs({ verificationCode: 'P-123456BB', locale })
        .resolves(shareableCertificate);
      requestResponseUtils.extractLocaleFromRequest.withArgs(request).returns(locale);

      // when
      const response = await certificationController.getCertificationByVerificationCode(request, hFake);

      // then
      expect(response).to.deep.equal({
        data: {
          id: '123',
          type: 'certifications',
          attributes: {
            'first-name': 'Dorothé',
            'last-name': '2Pac',
            birthdate: '2000-01-01',
            birthplace: 'Sin City',
            'certification-center': 'Centre des choux de Bruxelles',
            date: new Date('2020-01-01T00:00:00Z'),
            'delivered-at': new Date('2021-01-01T00:00:00Z'),
            'is-published': true,
            'pix-score': 456,
            'clea-certification-status': 'acquired',
            'certified-badge-images': ['/img/1'],
            'max-reachable-level-on-certification-date': 6,
          },
          relationships: {
            'result-competence-tree': {
              data: null,
            },
          },
        },
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCertificationAttestation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return attestation in PDF binary format', async function () {
      // given
      const certification = domainBuilder.buildPrivateCertificateWithCompetenceTree();
      const attestationPDF = 'binary string';
      const fileName = 'attestation-pix-20181003.pdf';
      const userId = 1;

      const request = {
        auth: { credentials: { userId } },
        params: { id: certification.id },
        query: { isFrenchDomainExtension: true },
      };

      sinon
        .stub(usecases, 'getCertificationAttestation')
        .withArgs({
          userId,
          certificationId: certification.id,
        })
        .resolves(certification);

      sinon
        .stub(certificationAttestationPdf, 'getCertificationAttestationsPdfBuffer')
        .withArgs({ certificates: [certification], isFrenchDomainExtension: true })
        .resolves({ buffer: attestationPDF, fileName });

      // when
      const response = await certificationController.getPDFAttestation(request, hFake);

      // then
      expect(response.source).to.deep.equal(attestationPDF);
      expect(response.headers['Content-Disposition']).to.contains('attachment; filename=attestation-pix-20181003.pdf');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#neutralizeChallenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('neutralizes the challenge and dispatches the event', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'neutralizeChallenge');
      sinon.stub(events, 'eventDispatcher').value({
        dispatch: sinon.stub(),
      });

      // when
      await certificationController.neutralizeChallenge(request, hFake);

      // then
      expect(usecases.neutralizeChallenge).to.have.been.calledWith({
        certificationCourseId: 1,
        challengeRecId: 'rec43mpMIR5dUzdjh',
        juryId: 7,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 204', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'neutralizeChallenge');
      sinon.stub(events, 'eventDispatcher').value({
        dispatch: sinon.stub(),
      });

      // when
      const response = await certificationController.neutralizeChallenge(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('dispatches an event', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      const eventToBeDispatched = new ChallengeNeutralized({ certificationCourseId: 1, juryId: 7 });
      sinon.stub(usecases, 'neutralizeChallenge').resolves(eventToBeDispatched);
      sinon.stub(events, 'eventDispatcher').value({
        dispatch: sinon.stub(),
      });

      // when
      await certificationController.neutralizeChallenge(request, hFake);

      // then
      expect(events.eventDispatcher.dispatch).to.have.been.calledWithExactly(eventToBeDispatched);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deneutralizeChallenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('deneutralizes the challenge', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'deneutralizeChallenge');
      sinon.stub(events, 'eventDispatcher');

      // when
      await certificationController.deneutralizeChallenge(request, hFake);

      // then
      expect(usecases.deneutralizeChallenge).to.have.been.calledWith({
        certificationCourseId: 1,
        challengeRecId: 'rec43mpMIR5dUzdjh',
        juryId: 7,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns 204', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      sinon.stub(usecases, 'deneutralizeChallenge');
      sinon.stub(events, 'eventDispatcher');

      // when
      const response = await certificationController.deneutralizeChallenge(request, hFake);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('dispatches the event', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              certificationCourseId: 1,
              challengeRecId: 'rec43mpMIR5dUzdjh',
            },
          },
        },
        auth: { credentials: { userId: 7 } },
      };
      const eventToBeDispatched = new ChallengeDeneutralized({ certificationCourseId: 1, juryId: 7 });

      sinon.stub(usecases, 'deneutralizeChallenge').resolves(eventToBeDispatched);
      sinon.stub(events, 'eventDispatcher').value({
        dispatch: sinon.stub(),
      });

      // when
      await certificationController.deneutralizeChallenge(request, hFake);

      // then
      expect(events.eventDispatcher.dispatch).to.have.been.calledWith(eventToBeDispatched);
    });
  });
});
