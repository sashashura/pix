// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'INITIAL_ID... Remove this comment to see the full error message
const INITIAL_ID = 100000;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  objectsToInsert: [],
  nextId: INITIAL_ID,

  pushInsertable({
    tableName,
    values
  }: $TSFixMe) {
    this.objectsToInsert.push({ tableName, values });

    return values;
  },

  getNextId() {
    return this.nextId++;
  },

  purge() {
    this.objectsToInsert = [];
  },
};
