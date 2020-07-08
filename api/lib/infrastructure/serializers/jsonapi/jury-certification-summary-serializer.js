const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serializeForPaginatedList(juryCertificationSummariesForPaginatedList) {
    const { juryCertificationSummaries, pagination } = juryCertificationSummariesForPaginatedList;
    return this.serialize(juryCertificationSummaries, pagination);
  },

  serialize(juryCertificationSummary, meta) {
    return new Serializer('jury-certification-summary', {
      attributes: [
        'firstName',
        'lastName',
        'status',
        'pixScore',
        'createdAt',
        'completedAt',
        'isPublished',
        'examinerComment',
        'hasSeenEndTestScreen',
      ],
      meta
    }).serialize(juryCertificationSummary);
  },
};
