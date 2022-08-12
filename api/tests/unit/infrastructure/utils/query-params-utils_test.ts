// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractPar... Remove this comment to see the full error message
const { extractParameters } = require('../../../../lib/infrastructure/utils/query-params-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | Query Params Utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#extractParameters', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract multiple parameters from request Object', function () {
      // given
      const query = {
        'filter[courseId]': '26',
        'filter[userId]': '1',
        'page[number]': '1',
        'page[size]': '200',
        sort: '-createdAt,id',
        include: 'user,organization',
      };

      // when
      const result = extractParameters(query);

      // then
      expect(result).to.deep.equal({
        filter: {
          courseId: '26',
          userId: '1',
        },
        page: {
          number: 1,
          size: 200,
        },
        sort: ['-createdAt', 'id'],
        include: ['user', 'organization'],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an object with empty properties if query does not contain jsonapi params', function () {
      // given
      const query = {
        page: 1,
        pageSize: 10,
      };

      // when
      const result = extractParameters(query);

      // then
      expect(result).to.deep.equal({
        filter: {},
        page: {},
        sort: [],
        include: [],
      });
    });
  });
});
