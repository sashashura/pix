// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('chai');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseArgs'... Remove this comment to see the full error message
  parseArgs,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toCSVRow'.
  toCSVRow,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildReque... Remove this comment to see the full error message
  buildRequestObject,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findCompet... Remove this comment to see the full error message
  findCompetence,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HEADERS'.
  HEADERS,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/certification/get-results-certifications-old');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Get Result Certifications Script OLD', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('parseArgs', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array', function () {
      // given
      const args = ['/usr/bin/node', '/path/to/script.js', 'http://localhost:3000', '1', '2', '3'];
      // when
      const result = parseArgs(args);
      // then
      expect(result).to.be.an('array');
      expect(result).to.deep.equals(['1', '2', '3']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('buildRequestObject', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should take an id and return a request object', function () {
      // given
      const courseId = 12;
      const baseUrl = 'http://localhost:3000';
      const authToken = 'jwt.tokken';

      // when
      const result = buildRequestObject(baseUrl, authToken, courseId);
      // then
      expect(result).to.have.property('json', true);
      expect(result).to.have.property('url', '/api/admin/certifications/12/details');
      expect(result.headers).to.have.property('authorization', 'Bearer jwt.tokken');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add certificationId to API response when the object is transform after the request', function () {
      // given
      const baseUrl = 'http://localhost:3000';
      const requestObject = buildRequestObject(baseUrl, '', 12);
      // when
      const result = requestObject.transform({});
      // then
      expect(result).to.have.property('certificationId', 12);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('toCSVRow', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should normalize a JSON object', function () {
      // given
      const object = { competencesWithMark: [] };
      // when
      const result = toCSVRow(object);
      // then
      expect(result).to.have.all.keys(HEADERS);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract certificationId, date, and pix score', function () {
      // given
      const object = {
        certificationId: '1337',
        totalScore: 7331,
        createdAt: new Date('2018-01-31T09:01:00Z'),
        completedAt: new Date('2018-01-31T09:29:16Z'),
        competencesWithMark: [],
      };
      // when
      const result = toCSVRow(object);
      // then
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result[HEADERS[0]]).to.equals('1337');
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result[HEADERS[1]]).to.equals('31/01/2018 10:01:00');
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result[HEADERS[2]]).to.equals('31/01/2018 10:29:16');
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result[HEADERS[3]]).to.equals(7331);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract competences', function () {
      // given
      const object = { competencesWithMark: [] };
      // when
      const result = toCSVRow(object);
      // then
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result[HEADERS[4]]).to.equals('');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract competences 1.1', function () {
      // given
      const object = {
        competencesWithMark: [
          {
            name: "Sécuriser l'environnement numérique",
            index: '1.1',
            id: 'rec',
            obtainedLevel: 9001,
          },
        ],
      };
      // when
      const result = toCSVRow(object);
      // then
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result['1.1']).to.equals(9001);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should extract all competences', function () {
      // given
      const object = {
        competencesWithMark: [
          {
            name: 'Mener une recherche',
            index: '1.1',
            id: 'rec',
            obtainedLevel: 4,
          },
          {
            name: "Sécuriser l'environnement numérique",
            index: '1.2',
            id: 'rec',
            obtainedLevel: 6,
          },
        ],
      };
      // when
      const result = toCSVRow(object);
      // then
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result['1.1']).to.equals(4);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      expect(result['1.2']).to.equals(6);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('findCompetence', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return empty string when not found', function () {
      // given
      const profile: $TSFixMe = [];
      const competenceName = '1.1';
      // when
      const result = findCompetence(profile, competenceName);
      // then
      expect(result).to.be.equals('');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return competence obtainedLevel when found', function () {
      // given
      const profile = [
        {
          name: "Sécuriser l'environnement numérique",
          index: '1.1',
          id: 'rec',
          obtainedLevel: 9,
        },
      ];
      const competenceName = '1.1';
      // when
      const result = findCompetence(profile, competenceName);
      // then
      expect(result).to.be.equals(9);
    });
  });
});
