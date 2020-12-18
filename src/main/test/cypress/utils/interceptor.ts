import { Method } from 'axios';
import { StaticResponse } from 'cypress/types/net-stubbing';
import faker from 'faker';

export class Interceptor {
  private count = 0;

  private constructor(method: Method, url: RegExp, response: StaticResponse) {
    cy.intercept(method, url, (req) => {
      this.count += 1;
      req.reply(response);
    });
  }

  static mockOk(method: Method, url: RegExp, response?: Omit<StaticResponse, 'staticCode'>) {
    return new Interceptor(method, url, { statusCode: 200, ...response });
  }

  static mockForbidden(method: Method, url: RegExp) {
    return new Interceptor(method, url, { statusCode: 403, body: { error: faker.random.words() } });
  }

  static mockUnauthorized(url: RegExp) {
    return new Interceptor('POST', url, { statusCode: 401, body: { error: faker.random.words() } });
  }

  static mockServerError(method: Method, url: RegExp) {
    return new Interceptor(method, url, {
      statusCode: 500,
      body: {
        error: faker.random.words(),
      },
    });
  }

  static mockCustomErrors(method: Method, url: RegExp, statusCodes: number[]) {
    return new Interceptor(method, url, { statusCode: faker.helpers.randomize(statusCodes) });
  }

  testCount(count: number) {
    assert.deepEqual(this.count, count);
  }
}
