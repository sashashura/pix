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
  try {
    const dn = req.dn.toString();

    console.log('NOUS SOMMES DANS LE SEARCH, DN BIEN REÇU : ', dn);
    console.log('filter ', req.filter);

    const where = {};

    function applyFilter(filter) {
      switch (filter.type) {
        case 'equal':
          switch (filter.attribute) {
            case 'mail':
              where.email = filter.value;
              break;
            case 'uid':
              where.id = filter.value;
              break;
            case 'cn':
              where.username = filter.value;
              break;
            case 'sn':
              where.lastName = filter.value;
              break;
            case 'objectclass':
              console.log('Ignoring filter on', filter.attribute);
              break;
            default:
              throw new Error('Unsupported filter attribute:' + filter.attribute);
          }
          break;

        case 'and':
          filter.filters.forEach(applyFilter);
          break;

        default:
          throw new Error('Unsupported filter type:' + filter.type);
      }
    }

    applyFilter(req.filter);

    function sendUser(user) {
      if (user) {
        res.send({
          dn: `uid=${user.id},o=pix`,
          attributes: {
            uid: user.id,
            mail: user.email,
            cn: user.username,
            givenName: user.firstName,
            sn: user.lastName,
          },
        });
      }

      res.end();
      return next();
    }

    function ignoreError(error) {
      console.log(error);
      res.end();
      return next();
    }

    return knex('users').where(where).first().then(sendUser).catch(ignoreError);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

server.add('o=pix', (req, res, next) => {
  console.log('ON EST DANS LE ADD');
  console.debug(req.toObject());
  const entry = req.toObject().attributes;

  async function addUser() {
    await knex('users').insert({
      username: entry.cn[0],
      firstName: 'TBD',
      lastName: 'TBD',
    });
  }

  return addUser().then(
    () => {
      res.end();
      return next();
    },
    (err) => {
      if (err.constraint === 'users_username_unique') {
        return next(new ldap.EntryAlreadyExistsError(req.dn.toString()));
      }
      console.error(err);
      // ladp.js pas content si l'objet Error a une propriété `code` qui n'est pas un nombre
      // or knex renvoie des erreurs avec un `code` en chaîne
      return next(new Error(err));
    }
  );
});

server.modify('o=pix', (req, res, next) => {
  async function applyChanges(where) {
    const userUpdates = {};
    for (const change of req.changes) {
      const mod = change.modification;
      const [value] = mod.vals;
      console.debug(change.operation, mod.type, 'with', value);
      if (change.operation == 'replace') {
        switch (mod.type.toLowerCase()) {
          case 'userpassword': {
            const [newPassword] = value;
            const hashedPassword = await encryptionService.hashPassword(newPassword);
            await authenticationMethodRepository.updateChangedPassword({
              userId: where.id,
              hashedPassword,
            });
            break;
          }

          case 'sn':
            userUpdates['lastName'] = value;
            break;

          case 'givenname':
            userUpdates['firstName'] = value;
            break;

          default:
            console.warn('Ignoring modification of', mod.type);
            break;
        }
      } else {
        throw new Error("Can't apply this modification");
      }
    }
    if (Object.keys(userUpdates).length > 0) {
      await knex('users').where(where).update(userUpdates);
    }
  }

  function handleError(e) {
    console.error(e);
    return next(e);
  }

  try {
    console.log('ON EST DANS LE MODIFY', req.object.toString());


    // On récupère le bout du DN à mettre à jour (`uid=1` dans `uid=1,o=pix`)
    const {
      rdns: [rdn],
    } = req.object;

    // On regarde si le DN était de la forme `uid=1,o=pix` ou bien `cn=toto,o=pix`
    // et on met à jour le filtre where en fonction
    const where = {};
    if (rdn.attrs.uid) {
      where.id = rdn.attrs.uid.value;
    } else if (rdn.attrs.cn) {
      where.username = rdn.attrs.cn.value;
    } else {
      throw new Error('Missing attribute on DN');
    }

    return applyChanges(where).then(() => {
      res.end();
      return next();
    }, handleError);
  } catch (e) {
    handleError(e);
  }
});

///--- Fire it up

server.listen(1389, () => {
  console.log('LDAP server up at: %s', server.url);
});
