const legitimateUsages = [];
const nonLegitimateUsages = [{ identifier: 'public.pole-emploi-sendings.payload', rule: 'prefer-jsonb-to-json' }];
const exceptions = [...nonLegitimateUsages, ...legitimateUsages];
module.exports = exceptions;
