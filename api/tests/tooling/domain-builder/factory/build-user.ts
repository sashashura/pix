// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildMembe... Remove this comment to see the full error message
const buildMembership = require('./build-membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenterMembership = require('./build-certification-center-membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAuthe... Remove this comment to see the full error message
const buildAuthenticationMethod = require('./build-authentication-method');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUser({ id = 123, firstName = 'Lorie', lastName = 'MeilleureAmie', email = 'jeseraila@example.net', username, cgu = true, lang = 'fr', lastTermsOfServiceValidatedAt = null, lastPixOrgaTermsOfServiceValidatedAt = null, lastPixCertifTermsOfServiceValidatedAt = null, mustValidateTermsOfService = false, pixOrgaTermsOfServiceAccepted = false, pixCertifTermsOfServiceAccepted = false, hasSeenAssessmentInstructions = false, isAnonymous = false, memberships = [buildMembership()], certificationCenterMemberships = [buildCertificationCenterMembership()], authenticationMethods = [(buildAuthenticationMethod as $TSFixMe).withPixAsIdentityProviderAndHashedPassword()] }: $TSFixMe = {}) {
    return new User({
        id,
        firstName,
        lastName,
        email,
        username,
        cgu,
        lang,
        lastTermsOfServiceValidatedAt,
        lastPixOrgaTermsOfServiceValidatedAt,
        lastPixCertifTermsOfServiceValidatedAt,
        mustValidateTermsOfService,
        pixOrgaTermsOfServiceAccepted,
        pixCertifTermsOfServiceAccepted,
        hasSeenAssessmentInstructions,
        isAnonymous,
        memberships,
        certificationCenterMemberships,
        authenticationMethods,
    });
};
