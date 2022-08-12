// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfStage = require('../orm-models/Stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, ObjectValidationError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByCampaignId(campaignId: $TSFixMe) {
    const results = await BookshelfStage.query((qb: $TSFixMe) => {
      qb.join('campaigns', 'campaigns.targetProfileId', 'stages.targetProfileId');
      qb.where('campaigns.id', '=', campaignId);
      qb.orderBy('stages.threshold');
    }).fetchAll({ require: false });

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfStage, results);
  },

  findByTargetProfileId(targetProfileId: $TSFixMe) {
    return BookshelfStage.where({ targetProfileId })
      .orderBy('threshold')
      .fetchAll({ require: false })
      .then((results: $TSFixMe) => bookshelfToDomainConverter.buildDomainObjects(BookshelfStage, results));
  },

  async create(stage: $TSFixMe) {
    const stageAttributes = _.pick(stage, ['title', 'message', 'threshold', 'targetProfileId']);
    const createdStage = await new BookshelfStage(stageAttributes).save();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfStage, createdStage);
  },

  async updateStage({
    id,
    title,
    message,
    threshold,
    prescriberTitle,
    prescriberDescription
  }: $TSFixMe) {
    try {
      await new BookshelfStage({ id }).save(
        { title, message, threshold, prescriberTitle, prescriberDescription },
        { patch: true }
      );
    } catch (error) {
      if (error instanceof BookshelfStage.NoRowsUpdatedError) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        throw new NotFoundError(`Le palier avec l'id ${id} n'existe pas`);
      }
      throw new ObjectValidationError();
    }
  },

  async get(id: $TSFixMe) {
    const bookshelfStage = await BookshelfStage.where('id', id)
      .fetch()
      .catch((err: $TSFixMe) => {
        if (err instanceof BookshelfStage.NotFoundError) {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          throw new NotFoundError(`Not found stage for ID ${id}`);
        }
        throw err;
      });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfStage, bookshelfStage);
  },
};
