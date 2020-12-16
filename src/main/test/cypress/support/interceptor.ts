import { Method } from 'axios';
import faker from 'faker';

export class Interceptor {
  private count = 0;

  private constructor(method: Method, url: RegExp, status: number, body: any) {
    cy.intercept(method, url, (req) => {
      this.count += 1;
      req.reply({ statusCode: status, body });
    });
  }

  static mockOk(method: Method, url: RegExp, body?: any) {
    return new Interceptor(method, url, 200, body);
  }

  static mockForbidden(url: RegExp) {
    return new Interceptor('POST', url, 403, { error: faker.random.words() });
  }

  static mockUnauthorized(url: RegExp) {
    return new Interceptor('POST', url, 401, { error: faker.random.words() });
  }

  static mockServerError(method: Method, url: RegExp) {
    return new Interceptor(method, url, 500, {
      error: faker.random.words(),
    });
  }

  static mockCustomErrors(method: Method, url: RegExp, statusCodes: number[], body?: any) {
    return new Interceptor(method, url, faker.helpers.randomize(statusCodes), body);
  }

  testCount(count: number) {
    assert.deepEqual(this.count, count);
  }
}
