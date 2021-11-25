require('dotenv').config();
const userRepository = require('./lib/infrastructure/repositories/user-repository');
const authenticationMethodRepository = require('./lib/infrastructure/repositories/authentication-method-repository');
const ldap = require('ldapjs');
const { knex } = require('./db/knex-database-connection');
const encryptionService = require('./lib/domain/services/encryption-service');

///--- Shared handlers

function authorize(req, res, next) {
  /* Any user may search after bind, only cn=root has full power */
  const isSearch = req instanceof ldap.SearchRequest;
  if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch) return next(new ldap.InsufficientAccessRightsError());

  return next();
}

///--- Globals

const SUFFIX = 'o=pix';
const server = ldap.createServer();

server.bind('cn=root', (req, res, next) => {
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret') return next(new ldap.InvalidCredentialsError());

  res.end();
  return next();
});

server.bind(SUFFIX, (req, res, next) => {
  const dn = req.dn.toString();
  console.log('------------');
  console.log(dn);
  console.log(req.credentials);
  // const password = req.credentials;
  const [, userId] = dn.toString().match(/^uid=([0-9]+)/);
  console.log({ userId });

  knex('authentication-methods')
    .where({ userId, identityProvider: 'PIX' })
    .pluck('authenticationComplement')
    .then(([{ password }]) => {
      console.log({ password });
      return encryptionService.checkPassword({ password: req.credentials, passwordHash: password }).then(() => {
        res.end();
        return next();
      });
    })
    .catch(() => {
      return next(new ldap.InvalidCredentialsError());
    });
});

server.search(SUFFIX, authorize, (req, res, next) => {
  const dn = req.dn.toString();

  console.log('NOUS SOMMES DANS LE SEARCH, DN BIEN REÇU : ', dn);
  console.log('filter ', req.filter);
  const mailFilter = req.filter.filters.find((filter) => filter.attribute === 'mail');
  const uidFilter = req.filter.filters.find((filter) => filter.attribute === 'uid');

  if (mailFilter) {
    const email = mailFilter.raw.toString('ascii');

    userRepository
      .getByEmail(email)
      .then((user) => {
        res.send({
          dn: `uid=${user.id},o=pix`,
          attributes: {
            uid: user.id,
            mail: user.email,
            cn: user.firstName,
          },
        });

        res.end();
        return next();
      })
      .catch((error) => {
        console.log(error);
        res.end();
        return next();
      });
  } else if (uidFilter) {
    const uid = uidFilter.raw.toString('ascii');

    userRepository
      .get(uid)
      .then((user) => {
        res.send({
          dn: `uid=${user.id},o=pix`,
          attributes: {
            uid: user.id,
            mail: user.email,
            cn: user.firstName,
          },
        });

        res.end();
        return next();
      })
      .catch((error) => {
        console.log(error);
        res.end();
        return next();
      });
  } else {
    throw new Error("can't handle this question");
  }
});

server.modify('o=pix', (req, res, next) => {
  console.log('ON EST DANS LE MODIFY');
  const {
    rdns: [
      {
        attrs: {
          uid: { value: uid },
        },
      },
    ],
  } = req.object;
  console.debug('found uid', uid);
  console.debug(`${req.changes.length} changes`);
  for (const change of req.changes) {
    const mod = change.modification;
    console.debug(change.operation, mod.type, 'with', mod.vals);
    if (mod.type == 'userpassword' && change.operation == 'replace') {
      const [newPassword] = mod.vals;
      return encryptionService
        .hashPassword(newPassword)
        .then((hashedPassword) => {
          return authenticationMethodRepository.updateChangedPassword({
            userId: uid,
            hashedPassword,
          });
        })
        .then(() => {
          res.end();
          return next();
        }, next);
    } else {
      throw new Error("Can't apply this modification");
    }
  }
  res.end();
  return next();
});

///--- Fire it up

server.listen(1389, () => {
  console.log('LDAP server up at: %s', server.url);
});
