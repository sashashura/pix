const _ = require('lodash');
const authenticationMethodRepository = require('../../repositories/authentication-method-repository');
const AuthenticationMethod = require('../../../domain/models/AuthenticationMethod');
const httpAgent = require('../../http/http-agent');
const settings = require('../../../config');
const { UnexpectedUserAccount } = require('../../../domain/errors');

module.exports = {
  async notify(userId, payload) {
    let authenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI });
    const accessToken = _.get(authenticationMethod, 'authenticationComplement.accessToken');
    if (!accessToken) {
      throw new UnexpectedUserAccount({ message: 'Le compte utilisateur n\'est pas rattaché à l\'organisation Pôle Emploi' });
    }

    const expiredDate = _.get(authenticationMethod, 'authenticationComplement.expiredDate');
    const refreshToken = _.get(authenticationMethod, 'authenticationComplement.refreshToken');
    if (!refreshToken || !expiredDate || expiredDate <= new Date()) {
      const data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_secret: settings.poleEmploi.clientSecret,
        client_id: settings.poleEmploi.clientId,
      };

      try {
        const response = await axios.post( // idéalement utiliser le httpAgent.post en lui ajoutant un retour `payload`
          settings.poleEmploi.tokenUrl,
          querystring.stringify(data),
          {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
          },
        );
      } catch (error) {
        return { // pour une raison X ou Y, l'envoi des résultats a échoué
          isSuccessful: false,
          code: error.code,
        };
      }
      const authenticationComplement = { truc: response.truc }; // construction à compléter
      authenticationMethod = await authenticationMethodRepository.updatePoleEmploiAuthenticationComplementByUserId({ authenticationComplement, userId });
    }

    const url = settings.poleEmploi.sendingUrl;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Service-source': 'Pix',
    };
    const httpResponse = await httpAgent.post(url, payload, headers);

    return {
      isSuccessful: httpResponse.isSuccessful,
      code: httpResponse.code,
    };
  },
};
