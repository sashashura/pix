// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getJuryCertification = require('../../../../lib/domain/usecases/get-jury-certification');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Usecase | get-jury-certification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the jury certification', async function () {
    // given
    const expectedJuryCertification = domainBuilder.buildJuryCertification({ certificationCourseId: 777 });
    const juryCertificationRepository = { get: sinon.stub() };
    juryCertificationRepository.get.withArgs(123).resolves(expectedJuryCertification);

    // when
    const juryCertification = await getJuryCertification({
      certificationCourseId: 123,
      juryCertificationRepository,
    });

    // then
    expect(juryCertification).to.deepEqualInstance(expectedJuryCertification);
  });
});
