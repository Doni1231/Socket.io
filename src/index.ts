// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ApplicationConfig, TodoListApplication} from './application';

// re-exports for our benchmark, not needed for the tutorial itself
export * from '@loopback/rest';
export * from './application';
export * from './models';
export * from './repositories';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodoListApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  return app;
}

if (require.main === module) {
  const port = process.env.PORT ?? 3000;
  const config = {
    rest: {
      port,
      host: process.env.HOST ?? 'localhost',
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
    websocket: {
      port,
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
