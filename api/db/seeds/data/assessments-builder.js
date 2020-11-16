const _ =  require('lodash');

module.exports = function assessmentsBuilder({ databaseBuilder }) {

  // PLACEMENT
  databaseBuilder.factory.buildAssessment({
    id: 1,
    courseId: null,
    competenceId: 'recDH19F7kKrfL3Ii',
    createdAt: new Date('2018-02-15T15:00:34Z'),
    updatedAt: new Date('2018-02-15T15:00:34Z'),
    userId: 1,
    type: 'PLACEMENT',
    state: 'completed',
  });
  databaseBuilder.factory.buildAssessment({
    id: 2,
    courseId: null,
    competenceId: 'recOdC9UDVJbAXHAm',
    createdAt: new Date('2018-02-15T15:00:34Z'),
    updatedAt: new Date('2018-02-15T15:00:34Z'),
    userId: 1,
    type: 'PLACEMENT',
    state: 'completed',
  });
  databaseBuilder.factory.buildAssessment({
    id: 3,
    courseId: null,
    competenceId: 'recsvLz0W2ShyfD63',
    createdAt: new Date('2018-02-15T15:03:18Z'),
    updatedAt: new Date('2018-02-15T15:03:18Z'),
    userId: 1,
    type: 'PLACEMENT',
    state: 'completed',
  });
  databaseBuilder.factory.buildAssessment({
    id: 4,
    courseId: null,
    competenceId: 'recNv8qhaY887jQb2',
    createdAt: new Date('2018-02-15T15:04:26Z'),
    updatedAt: new Date('2018-02-15T15:04:26Z'),
    userId: 1,
    type: 'PLACEMENT',
    state: 'completed',
  });
  databaseBuilder.factory.buildAssessment({
    id: 5,
    courseId: null,
    competenceId: 'recIhdrmCuEmCDAzj',
    createdAt: new Date('2018-02-15T15:07:02Z'),
    updatedAt: new Date('2018-02-15T15:07:02Z'),
    userId: 1,
    type: 'PLACEMENT',
    state: 'completed',
  });
  databaseBuilder.factory.buildAssessment({
    id: 8,
    courseId: null,
    competenceId: 'recOdC9UDVJbAXHAm',
    createdAt: new Date('2018-01-15T15:00:34Z'),
    updatedAt: new Date('2018-01-15T15:00:34Z'),
    userId: 1,
    type: 'PLACEMENT',
    state: 'started',
  });

  const assessmentId = databaseBuilder.factory.buildAssessment({ userId:2802, type: 'COMPETENCE_EVALUATION', state: 'completed' }).id;
  _.each([{ source: 'direct', skillId: 'rec22kidf1QiHbWwE', earnedPix: 0.8, status: 'validated', createdAt: new Date('2020-11-03 12:04:08.647+00'), competenceId: 'recsvLz0W2ShyfD63', result: 'ok', challengeId: 'rec1AyVTSI9GrzhdN', updatedAt: new Date('2020-11-03 12:04:08.646+00'), elapsedTime: 11, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rectLj7NPg5JcSIqN', earnedPix: 2.6666667, status: 'validated', createdAt: new Date('2020-11-03 12:04:08.647+00'), competenceId: 'recsvLz0W2ShyfD63', result: 'ok', challengeId: 'rec1AyVTSI9GrzhdN', updatedAt: new Date('2020-11-03 12:04:08.646+00'), elapsedTime: 11, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recRV35kIeqUQj8cI', earnedPix: 0.72727275, status: 'validated', createdAt: new Date('2020-11-03 12:04:28.291+00'), competenceId: 'recsvLz0W2ShyfD63', result: 'ok', challengeId: 'recX3USEK62h8rACE', updatedAt: new Date('2020-11-03 12:04:28.29+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec50IhKadDxbvjES', earnedPix: 2.6666667, status: 'validated', createdAt: new Date('2020-11-03 12:04:28.291+00'), competenceId: 'recsvLz0W2ShyfD63', result: 'ok', challengeId: 'recX3USEK62h8rACE', updatedAt: new Date('2020-11-03 12:04:28.29+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec6QF6wqqkQn9dN3', earnedPix: 0.8888889, status: 'validated', createdAt: new Date('2020-11-03 12:04:28.292+00'), competenceId: 'recsvLz0W2ShyfD63', result: 'ok', challengeId: 'recX3USEK62h8rACE', updatedAt: new Date('2020-11-03 12:04:28.29+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recfQIxf8y4Nrs6M1', earnedPix: 0.8, status: 'validated', createdAt: new Date('2020-11-03 12:04:28.292+00'), competenceId: 'recsvLz0W2ShyfD63', result: 'ok', challengeId: 'recX3USEK62h8rACE', updatedAt: new Date('2020-11-03 12:04:28.29+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec2h2MgU6BKQf6l0', earnedPix: 2.6666667, status: 'validated', createdAt: new Date('2020-11-03 12:05:30.203+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'rec2fB8PtE7OFHKwc', updatedAt: new Date('2020-11-03 12:05:30.202+00'), elapsedTime: 32, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec2RonVAUbKJGx91', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:06:56.764+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'aband', challengeId: 'rec1Y5FKhhBikiQpR', updatedAt: new Date('2020-11-03 12:06:56.761+00'), elapsedTime: 47, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recRAXPXVL2cMh5b5', earnedPix: 2.6666667, status: 'validated', createdAt: new Date('2020-11-03 12:05:30.204+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'rec2fB8PtE7OFHKwc', updatedAt: new Date('2020-11-03 12:05:30.202+00'), elapsedTime: 32, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec18tVfyux5wwHwN', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:06:56.765+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'aband', challengeId: 'rec1Y5FKhhBikiQpR', updatedAt: new Date('2020-11-03 12:06:56.761+00'), elapsedTime: 47, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recR1SlS7sWoquhoC', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:08:07.32+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'recNAsQlPdjjGG7nb', updatedAt: new Date('2020-11-03 12:08:07.318+00'), elapsedTime: 49, timeout: null, resultDetails: 'nom1: true nom2: true nom3: true ' },
    { source: 'direct', skillId: 'recqSPZiRJYzfCDaS', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:07:17.268+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'aband', challengeId: 'recCNPgqsZs1VC0aM', updatedAt: new Date('2020-11-03 12:07:17.266+00'), elapsedTime: 16, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recIyRA2zdCdlX6UD', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:07:17.268+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'aband', challengeId: 'recCNPgqsZs1VC0aM', updatedAt: new Date('2020-11-03 12:07:17.266+00'), elapsedTime: 16, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recp7rTXpecbxjE5d', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:07:17.268+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'aband', challengeId: 'recCNPgqsZs1VC0aM', updatedAt: new Date('2020-11-03 12:07:17.266+00'), elapsedTime: 16, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec4gk0caF0FsTUdU', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:08:44.169+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'partially', challengeId: 'recKVDoGz1cKdLsZs', updatedAt: new Date('2020-11-03 12:08:44.167+00'), elapsedTime: 36, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recHo6D1spbDR9C2N', earnedPix: 0, status: 'invalidated', createdAt: new Date('2020-11-03 12:08:44.169+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'partially', challengeId: 'recKVDoGz1cKdLsZs', updatedAt: new Date('2020-11-03 12:08:44.167+00'), elapsedTime: 36, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recQrIZ1YN7TEB4sa', earnedPix: 1, status: 'validated', createdAt: new Date('2020-11-03 12:09:20.85+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'reckt4dC4uCpnLGD4', updatedAt: new Date('2020-11-03 12:09:20.848+00'), elapsedTime: 33, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec2A5WpqRKEMMbUK', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:10:41.434+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'rec1wi3G4rSBT1sW8', updatedAt: new Date('2020-11-03 12:10:41.432+00'), elapsedTime: 50, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec2MXgC45TBYLTnx', earnedPix: 2.6666667, status: 'validated', createdAt: new Date('2020-11-03 12:10:41.435+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'rec1wi3G4rSBT1sW8', updatedAt: new Date('2020-11-03 12:10:41.432+00'), elapsedTime: 50, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec2lczM620ZxpZse', earnedPix: 2.6666667, status: 'validated', createdAt: new Date('2020-11-03 12:10:41.435+00'), competenceId: 'recMiZPNl7V1hyE1d', result: 'ok', challengeId: 'rec1wi3G4rSBT1sW8', updatedAt: new Date('2020-11-03 12:10:41.432+00'), elapsedTime: 50, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec9uQTL8ZFm1rSTY', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:11:20.425+00'), competenceId: 'recFpYXCKcyhLI3Nu', result: 'ok', challengeId: 'recit8wIdJWcSS34v', updatedAt: new Date('2020-11-03 12:11:20.423+00'), elapsedTime: 18, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recH8iHKeJ5iws289', earnedPix: 2, status: 'validated', createdAt: new Date('2020-11-03 12:11:20.425+00'), competenceId: 'recFpYXCKcyhLI3Nu', result: 'ok', challengeId: 'recit8wIdJWcSS34v', updatedAt: new Date('2020-11-03 12:11:20.423+00'), elapsedTime: 18, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recaMBgjv3EZnAlWO', earnedPix: 1, status: 'validated', createdAt: new Date('2020-11-03 12:11:42.951+00'), competenceId: 'recFpYXCKcyhLI3Nu', result: 'ok', challengeId: 'recdLelb1Djd1WXkz', updatedAt: new Date('2020-11-03 12:11:42.95+00'), elapsedTime: 21, timeout: null, resultDetails: 'n1: true n2: true n3: true ' },
    { source: 'inferred', skillId: 'recAFoEonOOChXe9t', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:11:42.951+00'), competenceId: 'recFpYXCKcyhLI3Nu', result: 'ok', challengeId: 'recdLelb1Djd1WXkz', updatedAt: new Date('2020-11-03 12:11:42.95+00'), elapsedTime: 21, timeout: null, resultDetails: 'n1: true n2: true n3: true ' },
    { source: 'inferred', skillId: 'rececWx6MmPhufxXk', earnedPix: 2, status: 'validated', createdAt: new Date('2020-11-03 12:11:42.952+00'), competenceId: 'recFpYXCKcyhLI3Nu', result: 'ok', challengeId: 'recdLelb1Djd1WXkz', updatedAt: new Date('2020-11-03 12:11:42.95+00'), elapsedTime: 21, timeout: null, resultDetails: 'n1: true n2: true n3: true ' },
    { source: 'direct', skillId: 'recQD6DtA2OuIucs1', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:14:25.458+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec7ceDce8ZEeekqN', updatedAt: new Date('2020-11-03 12:14:25.456+00'), elapsedTime: 6, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec2zofANqBsZdecI', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:12:50.899+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'rec1M1XGxV1QWFjqU', updatedAt: new Date('2020-11-03 12:12:50.897+00'), elapsedTime: 58, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recmLZ0CypLpsxm96', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:12:50.899+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'rec1M1XGxV1QWFjqU', updatedAt: new Date('2020-11-03 12:12:50.897+00'), elapsedTime: 58, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recd2VLjUfoo752CZ', earnedPix: 0.61538464, status: 'validated', createdAt: new Date('2020-11-03 12:13:42.033+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'recidsQzX2golFQs3', updatedAt: new Date('2020-11-03 12:13:42.031+00'), elapsedTime: 30, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec5V9gp65a58nnco', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:13:42.034+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'recidsQzX2golFQs3', updatedAt: new Date('2020-11-03 12:13:42.031+00'), elapsedTime: 30, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recKjdLuENEtJLx0f', earnedPix: 0.72727275, status: 'validated', createdAt: new Date('2020-11-03 12:13:42.034+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'recidsQzX2golFQs3', updatedAt: new Date('2020-11-03 12:13:42.031+00'), elapsedTime: 30, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'reclY3njuk6EySJuU', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:13:42.034+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'recidsQzX2golFQs3', updatedAt: new Date('2020-11-03 12:13:42.031+00'), elapsedTime: 30, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recghJRKeCNxdSleY', earnedPix: 0.61538464, status: 'validated', createdAt: new Date('2020-11-03 12:14:04.047+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'reciznBsSNTdxAARn', updatedAt: new Date('2020-11-03 12:14:04.045+00'), elapsedTime: 21, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec71e3PSct2zLEMj', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:14:04.047+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'reciznBsSNTdxAARn', updatedAt: new Date('2020-11-03 12:14:04.045+00'), elapsedTime: 21, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'receRbbt9Lb661wFB', earnedPix: 1.6, status: 'validated', createdAt: new Date('2020-11-03 12:14:04.047+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'reciznBsSNTdxAARn', updatedAt: new Date('2020-11-03 12:14:04.045+00'), elapsedTime: 21, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'reci1UtF7akUBqE1v', earnedPix: 0.72727275, status: 'validated', createdAt: new Date('2020-11-03 12:14:04.047+00'), competenceId: 'recOdC9UDVJbAXHAm', result: 'ok', challengeId: 'reciznBsSNTdxAARn', updatedAt: new Date('2020-11-03 12:14:04.045+00'), elapsedTime: 21, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recee4kZWBgjM8WrC', earnedPix: 0.8888889, status: 'validated', createdAt: new Date('2020-11-03 12:15:34.042+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec9dWL4xzf3plbJc', updatedAt: new Date('2020-11-03 12:15:34.039+00'), elapsedTime: 43, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recBrDIfDDW2IPpZV', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:15:34.042+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec9dWL4xzf3plbJc', updatedAt: new Date('2020-11-03 12:15:34.039+00'), elapsedTime: 43, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recTIddrkopID28Ep', earnedPix: 2, status: 'validated', createdAt: new Date('2020-11-03 12:15:34.042+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec9dWL4xzf3plbJc', updatedAt: new Date('2020-11-03 12:15:34.039+00'), elapsedTime: 43, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec2T8pBiKrpzP1SI', earnedPix: 1.3333334, status: 'validated', createdAt: new Date('2020-11-03 12:15:34.042+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec9dWL4xzf3plbJc', updatedAt: new Date('2020-11-03 12:15:34.039+00'), elapsedTime: 43, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rec2N5JmZbfVyfYyM', earnedPix: 0.8888889, status: 'validated', createdAt: new Date('2020-11-03 12:14:49.971+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec2o5v2F10SKey7b', updatedAt: new Date('2020-11-03 12:14:49.969+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec2RwtG1B6ZrKuVW', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:14:49.971+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec2o5v2F10SKey7b', updatedAt: new Date('2020-11-03 12:14:49.969+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rec2mPRRKmXze97P5', earnedPix: 1.3333334, status: 'validated', createdAt: new Date('2020-11-03 12:14:49.971+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec2o5v2F10SKey7b', updatedAt: new Date('2020-11-03 12:14:49.969+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'reclutStXNRyf32p9', earnedPix: 2, status: 'validated', createdAt: new Date('2020-11-03 12:14:49.971+00'), competenceId: 'recofJCxg0NqTqTdP', result: 'ok', challengeId: 'rec2o5v2F10SKey7b', updatedAt: new Date('2020-11-03 12:14:49.969+00'), elapsedTime: 19, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recfLjzQKBD8Umdcx', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:15:48.934+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'recZwA7fHzrE7CzM7', updatedAt: new Date('2020-11-03 12:15:48.933+00'), elapsedTime: 5, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'rece8ECIMBhHXgwo9', earnedPix: 0.8, status: 'validated', createdAt: new Date('2020-11-03 12:16:09.839+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'recP5w2VLfwYHhHUU', updatedAt: new Date('2020-11-03 12:16:09.837+00'), elapsedTime: 20, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recemvSVcBRVpdSL8', earnedPix: 0.8, status: 'validated', createdAt: new Date('2020-11-03 12:16:09.839+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'recP5w2VLfwYHhHUU', updatedAt: new Date('2020-11-03 12:16:09.837+00'), elapsedTime: 20, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recndXqXiv4pv2Ukp', earnedPix: 1, status: 'validated', createdAt: new Date('2020-11-03 12:16:09.839+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'recP5w2VLfwYHhHUU', updatedAt: new Date('2020-11-03 12:16:09.837+00'), elapsedTime: 20, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'rectL2ZZeWPc7yezp', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:16:09.84+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'recP5w2VLfwYHhHUU', updatedAt: new Date('2020-11-03 12:16:09.837+00'), elapsedTime: 20, timeout: null, resultDetails: 'null ' },
    { source: 'direct', skillId: 'recYrgY9k62xChdt7', earnedPix: 0.8, status: 'validated', createdAt: new Date('2020-11-03 12:17:01.911+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'rechh3Md8CqVUMBoV', updatedAt: new Date('2020-11-03 12:17:01.908+00'), elapsedTime: 51, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recG8X4DGZXl7lUIx', earnedPix: 0.8, status: 'validated', createdAt: new Date('2020-11-03 12:17:01.911+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'rechh3Md8CqVUMBoV', updatedAt: new Date('2020-11-03 12:17:01.908+00'), elapsedTime: 51, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recLCYATl7TGrkZLh', earnedPix: 1.1428572, status: 'validated', createdAt: new Date('2020-11-03 12:17:01.911+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'rechh3Md8CqVUMBoV', updatedAt: new Date('2020-11-03 12:17:01.908+00'), elapsedTime: 51, timeout: null, resultDetails: 'null ' },
    { source: 'inferred', skillId: 'recclxUSbi0fvIWpd', earnedPix: 2, status: 'validated', createdAt: new Date('2020-11-03 12:17:01.912+00'), competenceId: 'recudHE5Omrr10qrx', result: 'ok', challengeId: 'rechh3Md8CqVUMBoV', updatedAt: new Date('2020-11-03 12:17:01.908+00'), elapsedTime: 51, timeout: null, resultDetails: 'null ' }], (it) => {
    const answerId = databaseBuilder.factory.buildAnswer({ ...it, assessmentId, value: 'Dummy value' }).id;
    databaseBuilder.factory.buildKnowledgeElement({ ...it, answerId, userId:2802 ,assessmentId });
  });
};

