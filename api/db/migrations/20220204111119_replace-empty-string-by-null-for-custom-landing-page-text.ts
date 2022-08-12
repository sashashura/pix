// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex('campaigns').where({ customLandingPageText: '' }).update({ customLandingPageText: null });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  await knex('campaigns').where({ customLandingPageText: null }).update({ customLandingPageText: '' });
};
