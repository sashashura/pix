// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedAr... Remove this comment to see the full error message
const TargetedArea = require('../../../../lib/domain/models/TargetedArea');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedCompetence = require('./build-targeted-competence');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedArea = function buildTargetedArea({
  id = 'someAreaId',
  title = 'someTitle',
  color = 'someColor',
  code = 'someCode',
  frameworkId = 'someFmkId',
  competences = [buildTargetedCompetence()],
} = {}) {
  return new TargetedArea({
    id,
    title,
    color,
    code,
    frameworkId,
    competences,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildTargetedArea;
