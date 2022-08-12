// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const saveJuryComplementaryCertificationCourseResult = require('../../../../lib/domain/usecases/save-jury-complementary-certification-course-result');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | save-jury-complementary-certification-course-results', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveJuryComplementaryCertificationCourseResult', function () {
    let complementaryCertificationCourseResultRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      complementaryCertificationCourseResultRepository = {
        save: sinon.stub(),
        getFromComplementaryCertificationCourseId: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no Pix Edu complementaryCertificationCourseResult is found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        // given
        const complementaryCertificationCourseId = 12345;
        const juryLevel = 'juryLevel';
        complementaryCertificationCourseResultRepository.getFromComplementaryCertificationCourseId
          .withArgs({ complementaryCertificationCourseId })
          .resolves([]);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(saveJuryComplementaryCertificationCourseResult)({
          complementaryCertificationCourseId,
          juryLevel,
          complementaryCertificationCourseResultRepository,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.be.equal("Aucun résultat Pix+ Edu n'a été trouvé pour cette certification.");
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no Pix Edu complementaryCertificationCourseResult from PIX source is found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        // given
        const complementaryCertificationCourseId = 12345;
        const juryLevel = Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE;
        const pixEduComplementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          juryLevel,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
        });
        complementaryCertificationCourseResultRepository.getFromComplementaryCertificationCourseId
          .withArgs({ complementaryCertificationCourseId })
          .resolves([pixEduComplementaryCertificationCourseResult]);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(saveJuryComplementaryCertificationCourseResult)({
          complementaryCertificationCourseId,
          juryLevel,
          complementaryCertificationCourseResultRepository,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.be.equal("Aucun résultat Pix+ Edu n'a été trouvé pour cette certification.");
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a Pix Edu complementaryCertificationCourseResult from PIX source is found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the result', async function () {
        // given
        const complementaryCertificationCourseId = 1234;
        const partnerKey = Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE;

        const pixEduComplementaryCertificationCourseResult = domainBuilder.buildComplementaryCertificationCourseResult({
          partnerKey,
          complementaryCertificationCourseId,
          source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
        });
        const pixEduAndFromPixSourceComplementaryCertificationCourseResult =
          domainBuilder.buildComplementaryCertificationCourseResult({
            partnerKey,
            complementaryCertificationCourseId,
            source: ComplementaryCertificationCourseResult.sources.PIX,
          });
        complementaryCertificationCourseResultRepository.getFromComplementaryCertificationCourseId
          .withArgs({ complementaryCertificationCourseId })
          .resolves([
            pixEduComplementaryCertificationCourseResult,
            pixEduAndFromPixSourceComplementaryCertificationCourseResult,
          ]);

        // when
        await saveJuryComplementaryCertificationCourseResult({
          complementaryCertificationCourseId,
          juryLevel: partnerKey,
          complementaryCertificationCourseResultRepository,
        });

        // then
        expect(complementaryCertificationCourseResultRepository.save).to.have.been.calledWith(
          new ComplementaryCertificationCourseResult({
            partnerKey,
            source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
            acquired: true,
            complementaryCertificationCourseId:
              pixEduAndFromPixSourceComplementaryCertificationCourseResult.complementaryCertificationCourseId,
          })
        );
      });
    });
  });
});
