// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/student-certification-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'StudentFor... Remove this comment to see the full error message
const StudentForEnrollment = require('../../../../../lib/domain/read-models/StudentForEnrollment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | student-certification-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a StudentEnrollmentReadmodel model object into JSON API data', function () {
      // given
      const student = domainBuilder.buildOrganizationLearner();
      const studentEnrollmentReadmodel = new StudentForEnrollment({
        ...student,
        isEnrolled: true,
      });

      const expectedSerializedStudent = {
        data: {
          type: 'students',
          id: `${studentEnrollmentReadmodel.id}`,
          attributes: {
            'first-name': studentEnrollmentReadmodel.firstName,
            'last-name': studentEnrollmentReadmodel.lastName,
            birthdate: studentEnrollmentReadmodel.birthdate,
            division: studentEnrollmentReadmodel.division,
            'is-enrolled': studentEnrollmentReadmodel.isEnrolled,
          },
        },
      };

      // when
      const json = serializer.serialize(studentEnrollmentReadmodel);

      // then
      expect(json).to.deep.equal(expectedSerializedStudent);
    });
  });
});
