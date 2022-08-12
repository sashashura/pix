// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/challenge-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../../../../../lib/domain/models/Challenge');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | challenge-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Challenge model object into JSON API data', function () {
      // given
      const challenge = new Challenge({
        id: 'challenge_id',
        instruction: 'Que peut-on dire des œufs de catégorie A ?',
        proposals:
          '- Ils sont bio.\n- Ils pèsent plus de 63 grammes.\n- Ce sont des oeufs frais.\n- Ils sont destinés aux consommateurs.\n- Ils ne sont pas lavés.\n',
        type: 'QCM',
        illustrationUrl: 'http://illustration.url',
        timer: 300,
        competenceId: 'competence_id',
        attachments: [
          'http://challenge.attachement.url.docx',
          'http://challenge.attachement.url.odt',
          'http://challenge.attachement.url.fuck',
        ],
        embedUrl: 'https://github.io/page/epreuve.html',
        embedTitle: 'Epreuve de selection de dossier',
        embedHeight: 500,
        format: 'mots',
      });

      // when
      const json = serializer.serialize(challenge);

      // then
      expect(json).to.deep.equal({
        data: {
          type: 'challenges',
          id: challenge.id,
          attributes: {
            instruction: challenge.instruction,
            proposals: challenge.proposals,
            type: challenge.type,
            'illustration-url': challenge.illustrationUrl,
            timer: challenge.timer,
            competence: challenge.competenceId,
            attachments: [challenge.attachments[0], challenge.attachments[1], challenge.attachments[2]],
            'embed-url': 'https://github.io/page/epreuve.html',
            'embed-title': 'Epreuve de selection de dossier',
            'embed-height': 500,
            format: 'mots',
          },
        },
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('field "competence"', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be the the first associated to the challenge when it exists', function () {
        // given
        const challenge = new Challenge();
        challenge.id = 1;
        challenge.competenceId = 'competence_id';

        // when
        const json = serializer.serialize(challenge);

        // then
        expect(json).to.deep.equal({
          data: {
            type: 'challenges',
            id: '1',
            attributes: {
              competence: 'competence_id',
            },
          },
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be null when no competence is associated to the challenge (ex: DEMO course)', function () {
        // given
        const challenge = new Challenge();
        challenge.id = 1;

        // when
        const json = serializer.serialize(challenge);

        // then
        expect(json).to.deep.equal({
          data: {
            type: 'challenges',
            id: '1',
            attributes: {
              competence: 'N/A',
            },
          },
        });
      });
    });
  });
});
