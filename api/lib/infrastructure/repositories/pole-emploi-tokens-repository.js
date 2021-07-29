const settings = require('../../config');

const temporaryStorage = require('../temporary-storage');

const PoleEmploiTokens = require('../../domain/models/PoleEmploiTokens');

const EXPIRATION_DELAY_SECONDS = settings.poleEmploi.temporaryStorage.expirationDelaySeconds;

module.exports = {

  save(poleEmploiTokens) {
    return temporaryStorage.save({
      value: poleEmploiTokens,
      expirationDelaySeconds: EXPIRATION_DELAY_SECONDS,
    });
  },

  async getByKey(key) {
    const object = await temporaryStorage.get(key);
    console.log(`${JSON.stringify(object)} is an instance of ${object.constructor.name}`);
    return new PoleEmploiTokens(object);
  },
};
