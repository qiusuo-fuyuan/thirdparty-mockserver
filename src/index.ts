import express  from 'express';

import http from 'http';
import weChatMockServerRouter from './router/wechatMockServerRouter.js';

import ejs from 'ejs';

/**
 * Here, js ending has to be used, and the problem is reported here.
 * Currently no idea why the index.ts has to specify the js as ending. It could be
 * that after ts-loader transpile the ts file into js file. The file actually has 
 * ending of js
 * https://github.com/microsoft/TypeScript/issues/42151
 */


async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  
  app.engine('html', ejs.renderFile);

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  app.use("/", weChatMockServerRouter)

  // apply alipay router
  
  // Modified server startup
  await new Promise<void>(resolve => httpServer.listen({ port: 5000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:5000`);
}


startApolloServer();
