const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const sessionOptions = {
  name: 'mycookie',
  secret: 'cookiesafsdf',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  // for knexSessionStore
  store: new knexSessionStore({
    knex: require('../database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
}

const server = express();
// knexSessionStore(session);

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
