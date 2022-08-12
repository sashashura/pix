// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileWithLearningContent = require('../../../../lib/domain/models/TargetProfileWithLearningContent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedSkill = require('./build-targeted-skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedTube = require('./build-targeted-tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedCompetence = require('./build-targeted-competence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedArea = require('./build-targeted-area');

const buildTargetProfileWithLearningContent = function buildTargetProfileWithLearningContent({
  id = 123,
  name = 'Pour les champions du monde 1998 !! Merci Aimé',
  outdated = false,
  isPublic = false,
  isSimplifiedAccess = false,
  createdAt = new Date(),
  ownerOrganizationId,
  description = null,
  comment,
  skills = [],
  tubes = [],
  competences = [],
  areas = [],
  badges = [],
  stages = [],
  imageUrl,
  category = 'OTHER',
  tubesSelection = [],
  tubesSelectionAreas = []
}: $TSFixMe = {}) {
  return new TargetProfileWithLearningContent({
    id,
    name,
    outdated,
    isPublic,
    isSimplifiedAccess,
    createdAt,
    ownerOrganizationId,
    description,
    comment,
    skills,
    tubes,
    competences,
    areas,
    badges,
    stages,
    imageUrl,
    category,
    tubesSelection,
    tubesSelectionAreas,
  });
};

buildTargetProfileWithLearningContent.withSimpleLearningContent = function withSimpleLearningContent({
  id = 123,
  name = 'Pour les champions du monde 1998 !! Merci Aimé',
  outdated = false,
  isPublic = false,
  isSimplifiedAccess = false,
  imageUrl,
  createdAt = new Date(),
  ownerOrganizationId,
  description = null,
  comment = null,
  badges = [],
  stages = [],
  category = 'OTHER',
  tubesSelection = [],
  tubesSelectionAreas = []
}: $TSFixMe = {}) {
  const skill = buildTargetedSkill({ id: 'skillId', tubeId: 'tubeId' });
  const tube = buildTargetedTube({ id: 'tubeId', competenceId: 'competenceId', skills: [skill] });
  const competence = buildTargetedCompetence({ id: 'competenceId', areaId: 'areaId', tubes: [tube] });
  const area = buildTargetedArea({ id: 'areaId', competences: [competence] });
  return new TargetProfileWithLearningContent({
    id,
    name,
    outdated,
    isPublic,
    isSimplifiedAccess,
    imageUrl,
    createdAt,
    ownerOrganizationId,
    description,
    comment,
    tubesSelection,
    tubesSelectionAreas,
    skills: [skill],
    tubes: [tube],
    competences: [competence],
    areas: [area],
    badges,
    stages,
    category,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildTargetProfileWithLearningContent;
