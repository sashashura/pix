// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationHabilitation = require('../../../../lib/domain/models/ComplementaryCertificationHabilitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const COMPLEMENTARY_CERTIFICATION_HABILITATION_PROPS = ['id', 'complementaryCertificationId', 'certificationCenterId'];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ComplementaryCertificationHabilitation', function () {
  let complementaryCertificationHabilitation: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    complementaryCertificationHabilitation = domainBuilder.buildComplementaryCertificationHabilitation({
      complementaryCertificationId: 456,
      certificationCenterId: 789,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an object of the ComplementaryCertificationHabilitation type', function () {
    expect(complementaryCertificationHabilitation).to.be.instanceOf(ComplementaryCertificationHabilitation);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an object with all the requires properties', function () {
    expect(_.keys(complementaryCertificationHabilitation)).to.have.deep.members(
      COMPLEMENTARY_CERTIFICATION_HABILITATION_PROPS
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an object with correct properties using a domain builder', function () {
    // when
    const complementaryCertificationHabilitation = domainBuilder.buildComplementaryCertificationHabilitation({
      id: 123,
      complementaryCertificationId: 456,
      certificationCenterId: 789,
    });

    // then
    expect(complementaryCertificationHabilitation.id).to.equal(123);
    expect(complementaryCertificationHabilitation.complementaryCertificationId).to.equal(456);
    expect(complementaryCertificationHabilitation.certificationCenterId).to.equal(789);
  });
});
