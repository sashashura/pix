// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildAreaLearningContentDataObject({
  id = 'recvoGdo7z2z7pXWa',
  code = '1',
  name = '1. Information et données',
  titleFrFr = 'Information et données',
  titleEnUs = 'Information and data',
  competenceIds = ['recsvLz0W2ShyfD63', 'recNv8qhaY887jQb2', 'recIkYm646lrGvLNT'],
  color = 'jaffa',
} = {}) {
  return {
    id,
    code,
    name,
    titleFrFr,
    titleEnUs,
    competenceIds,
    color,
  };
};
