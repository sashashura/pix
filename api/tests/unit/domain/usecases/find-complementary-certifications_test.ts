// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findComplementaryCertifications = require('../../../../lib/domain/usecases/find-complementary-certifications');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-complementary-certifications', function () {
  let complementaryCertificationRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    complementaryCertificationRepository = {
      findAll: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should find the complementary certifications', async function () {
    // given
    const complementaryCertifications = [
      domainBuilder.buildComplementaryCertification({
        id: 11,
        name: 'Pix+Edu',
      }),
      domainBuilder.buildComplementaryCertification({
        id: 22,
        name: 'Cléa Numérique',
      }),
    ];
    complementaryCertificationRepository.findAll.resolves(complementaryCertifications);

    // when
    const result = await findComplementaryCertifications({
      complementaryCertificationRepository,
    });

    // then
    expect(result).to.deep.equal(complementaryCertifications);
  });
});
