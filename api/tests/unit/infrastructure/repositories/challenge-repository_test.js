const { expect, sinon } = require('../../../test-helper');
const airtable = require('../../../../lib/infrastructure/airtable');
const cache = require('../../../../lib/infrastructure/caches/cache');
const challengeRepository = require('../../../../lib/infrastructure/repositories/challenge-repository');
const challengeSerializer = require('../../../../lib/infrastructure/serializers/airtable/challenge-serializer');
const challengeDatasource = require('../../../../lib/infrastructure/datasources/airtable/challenge-datasource');

const Challenge = require('../../../../lib/domain/models/Challenge');
const Skill = require('../../../../lib/domain/models/Skill');

const ChallengeAirtableDataObjectFixture = require('../../../../tests/fixtures/infrastructure/ChallengeAirtableDataObjectFixture');
const ChallengeAirtableDataObject = require('../../../../lib/infrastructure/datasources/airtable/objects/Challenge');
const SkillAirtableDataObject = require('../../../../lib/infrastructure/datasources/airtable/objects/Skill');
const AirtableResourceNotFound = require('../../../../lib/infrastructure/datasources/airtable/objects/AirtableResourceNotFound');
const { NotFoundError } = require('../../../../lib/domain/errors');

const challengeDataSource = require('../../../../lib/infrastructure/datasources/airtable/challenge-datasource');
const skillDatasource = require('../../../../lib/infrastructure/datasources/airtable/skill-datasource');

function _buildChallenge(id, instruction, proposals) {
  return { id, instruction, proposals };
}

function _buildChallengeWithCompetence(id, instruction, proposals, competence, status) {
  return { id, instruction, proposals, competence, status };
}

describe('Unit | Repository | challenge-repository', () => {

  let getRecord;
  let getRecords;
  let challengeDataSourceGet;

  beforeEach(() => {
    cache.flushAll();

    getRecord = sinon.stub(airtable, 'getRecord');
    getRecords = sinon.stub(airtable, 'getRecords');
    challengeDataSourceGet = sinon.stub(challengeDataSource, 'get');
  });

  afterEach(() => {
    cache.flushAll();
    getRecord.restore();
    getRecords.restore();
    challengeDataSourceGet.restore();
  });

  describe('#list', () => {

    const cacheKey = 'challenge-repository_list';
    const challenges = [
      _buildChallenge('challenge_id_1', 'Instruction #1', 'Proposals #1'),
      _buildChallenge('challenge_id_2', 'Instruction #2', 'Proposals #2'),
      _buildChallenge('challenge_id_3', 'Instruction #3', 'Proposals #3')
    ];

    it('should reject with an error when the cache throw an error', function(done) {
      // given
      const cacheErrorMessage = 'Cache error';
      sinon.stub(cache, 'get').callsFake((key, callback) => {
        callback(new Error(cacheErrorMessage));
      });

      // when
      const result = challengeRepository.list();

      // then
      cache.get.restore();
      expect(result).to.eventually.be.rejectedWith(cacheErrorMessage);
      done();
    });

    it('should resolve with the challenges directly retrieved from the cache without calling airtable when the challenge has been cached', function(done) {
      // given
      getRecords.resolves(true);
      cache.set(cacheKey, challenges);

      // when
      const result = challengeRepository.list();

      // then
      expect(getRecords.notCalled).to.be.true;
      expect(result).to.eventually.deep.equal(challenges);
      done();
    });

    describe('when challenges have not been previously cached', () => {

      beforeEach(() => {
        getRecords.resolves(challenges);
      });

      it('should resolve with the challenges fetched from airtable', function(done) {
        // when
        const result = challengeRepository.list();

        // then
        expect(result).to.eventually.deep.equal(challenges);
        done();
      });

      it('should cache the challenge fetched from airtable', function(done) {
        // when
        challengeRepository.list().then(() => {

          // then
          cache.get(cacheKey, (err, cachedValue) => {
            expect(cachedValue).to.exist;
            done();
          });
        });
      });

      it('should query correctly airtable', function(done) {
        // given
        const expectedQuery = {};

        // when
        challengeRepository.list().then(() => {

          // then
          expect(getRecords.calledWith('Epreuves', expectedQuery, challengeSerializer)).to.be.true;
          done();
        });
      });
    });

  });

  describe('#findByCompetence', () => {

    const competence = { id: 'recsvLz0W2ShyfD63', reference: '1.1 Mener une recherche et une veille d\'information' };
    const cacheKey = `challenge-repository_find_by_competence_${competence.id}`;
    const challenges = [
      _buildChallengeWithCompetence('challenge_id_1', 'Instruction #1', 'Proposals #1', competence.id, 'validé'),
      _buildChallengeWithCompetence('challenge_id_2', 'Instruction #2', 'Proposals #2', competence.id, 'validé sans test'),
      _buildChallengeWithCompetence('challenge_id_3', 'Instruction #3', 'Proposals #3', competence.id, 'pre-validé')
    ];

    beforeEach(() => {
      sinon.stub(cache, 'get');
      sinon.stub(cache, 'set');
    });

    afterEach(() => {
      cache.get.restore();
      cache.set.restore();
    });

    context('when challenges have been cached', () => {

      it('should resolve challenges directly retrieved from the cache without calling Airtable', () => {
        // given
        cache.get.returns(challenges);

        // when
        const promise = challengeRepository.findByCompetence(competence);

        // then
        return promise.then(fetchedChallenges => {
          expect(fetchedChallenges).to.deep.equal(challenges);
          expect(getRecords).to.not.have.been.called;
          expect(cache.set).to.not.have.been.called;
        });
      });

    });

    context('when challenges have not been previously cached', function() {

      beforeEach(() => {
        getRecords.resolves(challenges);
        cache.get.returns();
        cache.set.returns();
      });

      it('should resolve with the challenges fetched from Airtable and filtered for this competence', () => {
        // when
        const promise = challengeRepository.findByCompetence(competence);

        // then
        return promise.then((fetchedChallenges) => {
          expect(airtable.getRecords).to.have.been.calledWith('Epreuves', { view: competence.reference }, challengeSerializer);
          expect(fetchedChallenges).to.deep.equal(challenges);
        });
      });

      it('should cache the challenges fetched from Airtable', () => {
        // when
        const promise = challengeRepository.findByCompetence(competence);

        // then
        return promise.then((fetchedChallenges) => {
          expect(cache.set).to.have.been.calledWith(cacheKey, fetchedChallenges);
        });
      });

    });

  });

  describe('#get', () => {

    beforeEach(() => {
      sinon.stub(skillDatasource, 'get').resolves();
    });

    afterEach(() => {
      skillDatasource.get.restore();
    });

    it('should resolve a Challenge domain object when the challenge exists', () => {
      // given
      const challengeRecordId = 'rec_challenge_id';
      challengeDataSource.get.withArgs(challengeRecordId).resolves(new ChallengeAirtableDataObject({
        id: challengeRecordId,
        type: 'QCU'
      }));

      // when
      const promise = challengeRepository.get(challengeRecordId);

      // then
      return promise.then((challenge) => {
        expect(challenge).to.be.an.instanceOf(Challenge);
        expect(challenge.id).to.equal(challengeRecordId);
        expect(challenge.type).to.equal('QCU');
      });
    });

    it('should have embed properties', () => {
      // given
      const challengeRecordId = 'rec_challenge_id';
      challengeDataSource.get.withArgs(challengeRecordId).resolves(ChallengeAirtableDataObjectFixture());

      // when
      const promise = challengeRepository.get(challengeRecordId);

      // then
      return promise.then((challenge) => {
        expect(challenge).to.be.an.instanceOf(Challenge);
        expect(challenge.embedUrl).to.equal('https://github.io/page/epreuve.html');
        expect(challenge.embedTitle).to.equal('Epreuve de selection de dossier');
        expect(challenge.embedHeight).to.equal(500);
      });
    });

    it('should load skills', () => {
      // given
      const challengeRecordId = 'rec_challenge_id';
      challengeDataSource.get.resolves(new ChallengeAirtableDataObject({
        skillIds: ['skillId_1', 'skillId_2']
      }));

      // when
      const promise = challengeRepository.get(challengeRecordId);

      // then
      return promise.then(() => {
        expect(skillDatasource.get).to.have.been.calledWith('skillId_1');
        expect(skillDatasource.get).to.have.been.calledWith('skillId_2');
      });
    });

    it('should load skills in the challenge', () => {
      // given
      const challengeRecordId = 'rec_challenge_id';
      challengeDataSource.get.resolves(new ChallengeAirtableDataObject({
        skillIds: ['123', '456']
      }));
      skillDatasource.get.withArgs('123').resolves(new SkillAirtableDataObject({ name: '@web1' }));
      skillDatasource.get.withArgs('456').resolves(new SkillAirtableDataObject({ name: '@url2' }));

      // when
      const promise = challengeRepository.get(challengeRecordId);

      // then
      return promise.then((challenge) => {
        expect(challenge.skills).to.have.lengthOf(2);
        expect(challenge.skills[0]).to.deep.equal(new Skill({ name: '@web1' }));
        expect(challenge.skills[1]).to.deep.equal(new Skill({ name: '@url2' }));
      });
    });

    context('when the datasource is on error', () => {
      it('should return a NotFoundError if the challenge is not found', () => {
        // given
        const challengeRecordId = 'rec_challenge_id';
        const error = new AirtableResourceNotFound();
        challengeDataSource.get.rejects(error);

        // when
        const promise = challengeRepository.get(challengeRecordId);

        // then
        return expect(promise).to.have.been.rejectedWith(NotFoundError);
      });

      it('should transfer the error', () => {
        // given
        const challengeRecordId = 'rec_challenge_id';
        const error = new Error();
        challengeDataSource.get.rejects(error);

        // when
        const promise = challengeRepository.get(challengeRecordId);

        // then
        return expect(promise).to.have.been.rejectedWith(error);
      });
    });
  });

  describe('#refresh', () => {

    const challengeId = 'challenge_id';
    const cacheKey = `challenge-repository_get_${challengeId}`;

    it('should reject with an error when the cache throw an error', () => {
      // given
      const cacheErrorMessage = 'Cache error';
      sinon.stub(cache, 'del').callsFake((key, callback) => {
        callback(new Error(cacheErrorMessage));
      });

      // when
      const result = challengeRepository.refresh(challengeId);

      // then
      cache.del.restore();
      return expect(result).to.eventually.be.rejectedWith(cacheErrorMessage);
    });

    it('should resolve with the challenge fetched from airtable when the challenge was not previously cached', () => {
      // given
      const challenge = {
        id: challengeId,
        instruction: 'Challenge instruction',
        proposals: 'Challenge proposals'
      };
      getRecord.resolves(challenge);

      // when
      const result = challengeRepository.refresh(challengeId);

      // then
      return expect(result).to.eventually.deep.equal(challenge);
    });

    it('should replace the old challenge by the new one in cache', () => {
      // given
      const oldCourse = {
        id: challengeId,
        name: 'Old challenge',
        description: 'Old description of the challenge'
      };
      cache.set(cacheKey, oldCourse);
      const newCourse = {
        id: challengeId,
        name: 'New challenge',
        description: 'new description of the challenge'
      };
      getRecord.resolves(newCourse);

      // when
      challengeRepository.refresh(challengeId).then(() => {

        // then
        cache.get(cacheKey, (err, cachedValue) => {
          expect(cachedValue).to.deep.equal(newCourse);
        });
      });
    });
  });

  describe('#findBySkills', () => {

    beforeEach(() => {
      sinon.stub(challengeDatasource, 'findBySkills').resolves([ChallengeAirtableDataObjectFixture(), ChallengeAirtableDataObjectFixture()]);
    });

    afterEach(() => {
      challengeDatasource.findBySkills.restore();
    });

    it('should call challengeDatasource with list of skills name and return challenges', () => {
      // given
      const skills = [new Skill({ name: '@element1' }), new Skill({ name: '@element2' })];

      // when
      const promise = challengeRepository.findBySkills(skills);

      // then
      return promise.then((challenges) => {
        expect(challengeDatasource.findBySkills).to.have.been.calledWith(['@element1', '@element2']);
        expect(challenges).to.be.an('array').and.to.have.lengthOf(2);
        expect(challenges[0]).to.be.an.instanceOf(Challenge);
      });
    });

    it('should return Challenge with skills', () => {
      // given
      const skills = [new Skill({ name: '@modèleEco3' })];

      // when
      const promise = challengeRepository.findBySkills(skills);

      // then
      return promise.then((challenges) => {
        expect(challenges[0]).to.be.an.instanceOf(Challenge);
        expect(challenges[0].skills).to.be.an('array').and.to.have.lengthOf(1);
        expect(challenges[0].skills[0].name).to.be.equal('@modèleEco3');
      });
    });

  });
});
