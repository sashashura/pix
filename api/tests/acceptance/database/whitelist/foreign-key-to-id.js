const legitimateUsages = [];
const nonLegitimateUsages = [{ identifierPattern: 'public\\.partner-certifications.*', rule: 'foreign-key-to-id' }];
const exceptions = [...nonLegitimateUsages, ...legitimateUsages];

module.exports = exceptions;
