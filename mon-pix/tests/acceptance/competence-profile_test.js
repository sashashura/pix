import { click, currentURL, find, visit } from '@ember/test-helpers';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { authenticateByEmail } from '../helpers/authentication';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';

describe('Acceptance | Profile | Start competence', function () {
  setupApplicationTest();
  setupMirage();
  let user;

  beforeEach(function () {
    user = server.create('user', 'withEmail');
  });

  describe('Authenticated cases as simple user', function () {
    beforeEach(async function () {
      await authenticateByEmail(user);
    });

    it('can start a competence', async function () {
      //given
      const firstScorecard = user.scorecards.models[0];
      const competenceId = firstScorecard.competenceId;
      const splitIndex = firstScorecard.index.split('.');
      const competenceNumber = splitIndex[splitIndex.length - 1];
      const assessment = server.create('assessment', 'ofCompetenceEvaluationType');
      server.create('challenge', 'forCompetenceEvaluation', 'QCM');
      server.create('competence-evaluation', { user, competenceId, assessment });

      // when
      await visit('/competences');
      await setBreakpoint('tablet');
      await click(
        `.rounded-panel-body__areas:nth-of-type(${firstScorecard.area.code}) .rounded-panel-body__competence-card:nth-of-type(${competenceNumber}) .competence-card__button`
      );

      // then
      expect(currentURL()).to.contains('/assessments/');
      expect(find('.challenge__content')).to.exist;
    });
  });
});
