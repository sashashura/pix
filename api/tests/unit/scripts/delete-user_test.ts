// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScriptQuer... Remove this comment to see the full error message
const { ScriptQueryBuilder, ClientQueryAdapter, UserEraser } = require('../../../scripts/delete-user');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Delete User Script', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('ScriptQueryBuilder', function () {
    let subject: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      subject = new ScriptQueryBuilder();
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#count_certifications_from_user_id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const userId = 213;

        // when
        const query = subject.count_certifications_from_user_id(userId);

        // then
        expect(query).to.equal(`SELECT COUNT(*) FROM "certification-courses" WHERE "userId" = '${userId}'`);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#get_user_id_from_email', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const email = 'jean.paul@pix.fr';

        // when
        const query = subject.get_user_id_from_email(email);

        // then
        expect(query).to.equal(`SELECT id FROM users WHERE email = '${email}'`);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#find_assessment_ids_from_user_id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const user_id = 123;

        // when
        const query = subject.find_assessment_ids_from_user_id(user_id);

        // then
        expect(query).to.equal(`SELECT id FROM assessments WHERE "userId" = '${user_id}'`);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_feedbacks_from_assessment_ids', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const assessment_ids = [123];

        // when
        const query = subject.delete_feedbacks_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal('DELETE FROM feedbacks WHERE "assessmentId" IN (123)');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query with comma as separator when many assessment ids', function () {
        // given
        const assessment_ids = [123, 456];

        // when
        const query = subject.delete_feedbacks_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal('DELETE FROM feedbacks WHERE "assessmentId" IN (123,456)');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return neutral query when assessmentIds is an empty array', function () {
        // given
        const assessment_ids: $TSFixMe = [];

        // when
        expect(() => subject.delete_feedbacks_from_assessment_ids(assessment_ids)).to.throw(Error);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_competence_marks_from_assessment_ids', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const assessment_ids = [123];

        // when
        const query = subject.delete_competence_marks_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal(
          'DELETE FROM "competence-marks" WHERE "assessmentResultId" IN ( SELECT id from "assessment-results" WHERE "assessmentId" IN (123) )'
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query with comma as separator when many assessment ids', function () {
        // given
        const assessment_ids = [123, 456];

        // when
        const query = subject.delete_competence_marks_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal(
          'DELETE FROM "competence-marks" WHERE "assessmentResultId" IN ( SELECT id from "assessment-results" WHERE "assessmentId" IN (123,456) )'
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return neutral query when assessmentIds is an empty array', function () {
        // given
        const assessment_ids: $TSFixMe = [];

        // when
        expect(() => subject.delete_competence_marks_from_assessment_ids(assessment_ids)).to.throw(Error);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_assessment_results_from_assessment_ids', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const assessment_ids = [123];

        // when
        const query = subject.delete_assessment_results_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal('DELETE FROM "assessment-results" WHERE "assessmentId" IN (123)');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query with comma as separator when many assessment ids', function () {
        // given
        const assessment_ids = [123, 456];

        // when
        const query = subject.delete_assessment_results_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal('DELETE FROM "assessment-results" WHERE "assessmentId" IN (123,456)');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return neutral query when assessmentIds is an empty array', function () {
        // given
        const assessment_ids: $TSFixMe = [];

        // when
        expect(() => subject.delete_assessment_results_from_assessment_ids(assessment_ids)).to.throw(Error);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_answers_from_assessment_ids', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const assessment_ids = [123];

        // when
        const query = subject.delete_answers_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal('DELETE FROM answers WHERE "assessmentId" IN (123)');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query with comma as separator when many assessment ids', function () {
        // given
        const assessment_ids = [123, 456];

        // when
        const query = subject.delete_answers_from_assessment_ids(assessment_ids);

        // then
        expect(query).to.equal('DELETE FROM answers WHERE "assessmentId" IN (123,456)');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return neutral query when assessmentIds is an empty array', function () {
        // given
        const assessment_ids: $TSFixMe = [];

        // when
        expect(() => subject.delete_answers_from_assessment_ids(assessment_ids)).to.throw(Error);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_assessment_ids_from_user_id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const user_id = 123;

        // when
        const query = subject.delete_assessments_from_user_id(user_id);

        // then
        expect(query).to.equal(`DELETE FROM assessments WHERE "userId" = '${user_id}'`);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_user_from_user_id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the correct query', function () {
        // given
        const user_id = 123;

        // when
        const query = subject.delete_user_from_user_id(user_id);

        // then
        expect(query).to.equal(`DELETE FROM users WHERE "id" = '${user_id}'`);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('ClientQueryAdapter', function () {
    let subject: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      subject = new ClientQueryAdapter();
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#unpack_user_id', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the user id from result object', function () {
        // given
        const queryResult = {
          rows: [{ id: 1 }],
        };

        // when
        const result = subject.unpack_user_id(queryResult);

        // then
        expect(result).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw when result has no rows', function () {
        // given
        const queryResult = {
          rows: [],
        };

        // then
        expect(() => subject.unpack_user_id(queryResult)).to.throw(Error);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#unpack_assessment_ids', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the assessment ids from result object', function () {
        // given
        const queryResult = {
          rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
        };

        // when
        const result = subject.unpack_assessment_ids(queryResult);

        // then
        expect(result).to.deep.equal([1, 2, 3]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return empty array when result has no rows', function () {
        // given
        const queryResult = {
          rows: [],
        };

        // when
        const result = subject.unpack_assessment_ids(queryResult);

        // then
        expect(result).to.be.empty;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('AssessmentEraser', function () {
    let subject: $TSFixMe;
    let queryBuilderMock: $TSFixMe;
    let clientStub: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const queryBuilder = new ScriptQueryBuilder();
      clientStub = { query_and_log: sinon.stub() };

      queryBuilderMock = sinon.mock(queryBuilder);
      const clientQueryAdapter = new ClientQueryAdapter();
      subject = new UserEraser(clientStub, queryBuilder, clientQueryAdapter);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#check_no_certification_done', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should count user's certifications", function () {
        // given
        const userId = 5186;
        subject.userId = userId;
        clientStub.query_and_log.resolves({
          rows: [{ count: 0 }],
        });

        queryBuilderMock.expects('count_certifications_from_user_id').once().withArgs(userId);

        // when
        const promise = subject.check_no_certification_done(userId);

        // then
        return promise.then(() => {
          queryBuilderMock.verify();
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should fail when user has already been certified', function () {
        // given
        const userId = 5186;
        subject.userId = userId;
        clientStub.query_and_log.resolves({
          rows: [{ count: 1 }],
        });

        // when
        const promise = subject.check_no_certification_done(userId);

        // then
        return expect(promise).to.be.rejectedWith('The user has been certified, deletion impossible');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#delete_dependent_data_from_fetched_assessment_ids', function () {
      let consoleLog: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        consoleLog = sinon.stub(console, 'log');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should delete feedbacks, answers, competence-marks and assessment-results', function () {
        // given
        const ids = [123, 456];
        subject.assessmentIds = ids;

        // when
        const promise = subject.delete_dependent_data_from_fetched_assessment_ids();

        // then
        return promise.then(() => {
          sinon.assert.callCount(clientStub.query_and_log, 4);

          expect(clientStub.query_and_log).to.have.been.calledWith(
            'DELETE FROM feedbacks WHERE "assessmentId" IN (123,456)'
          );
          expect(clientStub.query_and_log).to.have.been.calledWith(
            'DELETE FROM answers WHERE "assessmentId" IN (123,456)'
          );
          expect(clientStub.query_and_log).to.have.been.calledWith(
            'DELETE FROM "competence-marks" WHERE "assessmentResultId" IN ( SELECT id from "assessment-results" WHERE "assessmentId" IN (123,456) )'
          );
          expect(clientStub.query_and_log).to.have.been.calledWith(
            'DELETE FROM "assessment-results" WHERE "assessmentId" IN (123,456)'
          );
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not try to delete anything when no ids given', function () {
        // given
        const ids: $TSFixMe = [];
        subject.assessmentIds = ids;

        queryBuilderMock.expects('delete_feedbacks_from_assessment_ids').never();
        queryBuilderMock.expects('delete_answers_from_assessment_ids').never();
        queryBuilderMock.expects('delete_competence_marks_from_assessment_ids').never();
        queryBuilderMock.expects('delete_assessment_results_from_assessment_ids').never();

        // when
        const promise = subject.delete_dependent_data_from_fetched_assessment_ids();

        // then
        return promise.then(() => {
          queryBuilderMock.verify();
          const expectedLog =
            'No assessment found: skipping deletion of feedbacks, answers, competence-marks ' +
            'and assessment-results';
          sinon.assert.calledWith(consoleLog, expectedLog);
        });
      });
    });
  });
});
