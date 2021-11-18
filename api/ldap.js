const ldap = require('ldapjs');

///--- Shared handlers

function authorize(req, res, next) {
  /* Any user may search after bind, only cn=root has full power */
  const isSearch = req instanceof ldap.SearchRequest;
  if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch) return next(new ldap.InsufficientAccessRightsError());

  return next();
}

///--- Globals

const SUFFIX = 'o=pix';
const db = {
  'o=pix': { cn: 'Orga PIX', objectclass: 'organisation' },
  'cn=george, o=pix': {
    cn: 'george',
    objectclass: 'person',
    uid: '1',
    userpassword: ['pix123'],
    mail: 'user@example.net',
    givenName: 'George',
    sn: 'De Cambridge',
  },
};
const server = ldap.createServer();

server.bind('cn=root', (req, res, next) => {
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret') return next(new ldap.InvalidCredentialsError());

  res.end();
  return next();
});

server.bind(SUFFIX, (req, res, next) => {
  const dn = req.dn.toString();
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  if (!db[dn].userpassword) return next(new ldap.NoSuchAttributeError('userPassword'));

  if (db[dn].userpassword.indexOf(req.credentials) === -1) return next(new ldap.InvalidCredentialsError());

  res.end();
  return next();
});

server.search(SUFFIX, authorize, (req, res, next) => {
  const dn = req.dn.toString();
  console.log('NOUS SOMMES DANS LE SEARCH, DN BIEN REÇU : ', dn);
  console.log('request ', req);
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  let scopeCheck;

  switch (req.scope) {
    case 'base':
      if (req.filter.matches(db[dn])) {
        res.send({
          dn: dn,
          attributes: db[dn],
        });
      }

      res.end();
      return next();

    case 'one':
      scopeCheck = (k) => {
        if (req.dn.equals(k)) return true;

        const parent = ldap.parseDN(k).parent();
        return parent ? parent.equals(req.dn) : false;
      };
      break;

    case 'sub':
      scopeCheck = (k) => {
        return req.dn.equals(k) || req.dn.parentOf(k);
      };

      break;
  }

  const keys = Object.keys(db);
  for (const key of keys) {
    if (!scopeCheck(key)) continue;

    if (req.filter.matches(db[key])) {
      res.send({
        dn: key,
        attributes: db[key],
      });
    }
  }

  res.end();
  return next();
});

///--- Fire it up

server.listen(1389, () => {
  console.log('LDAP server up at: %s', server.url);
});
