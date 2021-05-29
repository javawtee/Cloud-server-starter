'use strict';

import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefsRoot, resolversRoot } from './routes/graphql';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  cors: cors({
    credentials: true,
    origin: '*'
  }),
  typeDefs: typeDefsRoot,
  resolvers: resolversRoot,
  tracing: true
});

server.applyMiddleware({
  app,
  path: '/app'
});

// Handles any requests that don't match the ones above
app.get('*', function (req, res) {
  //res.sendFile(path.join(__dirname, 'production', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app, server };
