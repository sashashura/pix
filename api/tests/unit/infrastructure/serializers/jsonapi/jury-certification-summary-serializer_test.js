const { expect, sinon } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/jury-certification-summary-serializer');

describe('Unit | Serializer | JSONAPI | jury-certification-summary-serializer', function() {

  describe('#serializeForPaginatedList()', function() {

    it('should call serialize method by destructuring passed parameter', function() {
      // given
      const restore = serializer.serialize;
      serializer.serialize = sinon.stub();
      const juryCertificationSummaries = Symbol('someJuryCertificationSummaries');
      const pagination = Symbol('pagination');
      const parameters = { juryCertificationSummaries, pagination, someUnusedField: 'unused' };

      // when
      serializer.serializeForPaginatedList(parameters);

      // then
      expect(serializer.serialize).to.have.been.calledWithExactly(juryCertificationSummaries, pagination);
      serializer.serialize = restore;
    });
  });

  describe('#serialize()', function() {

    let modelJuryCertifSummary;
    let expectedJsonApi;
    const meta = { page: 1, pageSize: 10, rowCount: 6, pageCount: 1 };

    beforeEach(() => {
      modelJuryCertifSummary = {
        id: 1,
        firstName: 'someFirstName',
        lastName: 'someLastName',
        status: 'someStatus',
        pixScore: 123,
        createdAt: new Date('2020-04-20T04:05:06Z'),
        completedAt: new Date('2020-04-25T04:05:06Z'),
        isPublished: true,
        examinerComment: 'someComment',
        hasSeenEndTestScreen: false,
      };
      expectedJsonApi = {
        data: {
          type: 'jury-certification-summaries',
          id: modelJuryCertifSummary.id.toString(),
          attributes: {
            'first-name': modelJuryCertifSummary.firstName,
            'last-name': modelJuryCertifSummary.lastName,
            'status': modelJuryCertifSummary.status,
            'pix-score': modelJuryCertifSummary.pixScore,
            'created-at': modelJuryCertifSummary.createdAt,
            'completed-at': modelJuryCertifSummary.completedAt,
            'is-published': modelJuryCertifSummary.isPublished,
            'examiner-comment': modelJuryCertifSummary.examinerComment,
            'has-seen-end-test-screen': modelJuryCertifSummary.hasSeenEndTestScreen,
          },
        }
      };
    });

    it('should convert a JuryCertificationSummary model object into JSON API data', function() {
      // when
      const json = serializer.serialize(modelJuryCertifSummary);

      // then
      expect(json).to.deep.equal(expectedJsonApi);
    });

    it('should add meta information', function() {
      // when
      const json = serializer.serialize(modelJuryCertifSummary, meta);

      // then
      expect(json.meta).to.deep.equal(meta);
    });
  });

});
