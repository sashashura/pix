const legitimateUsages = [];
const uncheckedUsages = [
  { identifier: 'public.partner-certifications', rule: 'require-primary-key' },
  { identifier: 'public.complementary-certification-courses', rule: 'require-primary-key' },
  { identifier: 'public.complementary-certification-subscriptions', rule: 'require-primary-key' },
];
const nonLegitimateUsages = [];
const exceptions = [...nonLegitimateUsages, ...legitimateUsages, ...uncheckedUsages];
module.exports = exceptions;
