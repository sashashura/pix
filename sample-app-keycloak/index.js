const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(session({ secret: 'foo', store: memoryStore }));

app.use(keycloak.middleware());

app.get('/alanoix', (req, res) => {
  res.send('Hello, world! from alanoix');
});

app.get('/check-sso', keycloak.protect(), (req, res) => {
  res.send('Hello, world! from check-sso');
});

app.listen(3000);
