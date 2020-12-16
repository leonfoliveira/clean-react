import { Method } from 'axios';
import faker from 'faker';

export class Interceptor {
  private count = 0;

  constructor(method: Method, url: RegExp, status: number, body: any) {
    cy.intercept(method, url, (req) => {
      this.count += 1;
      req.reply({ statusCode: status, body });
    });
  }

  static mockOk(method: Method, url: RegExp, body: any) {
    return new Interceptor(method, url, 200, body);
  }

  static mockEmailInUseError(url: RegExp) {
    return new Interceptor('POST', url, 403, { error: faker.random.words() });
  }

  static mockInvalidCredentialsError(url: RegExp) {
    return new Interceptor('POST', url, 401, { error: faker.random.words() });
  }

  static mockUnexpectedError(method: Method, url: RegExp) {
    return new Interceptor(method, url, faker.helpers.randomize([400, 404, 500]), {
      error: faker.random.words(),
    });
  }

  testCount(count: number) {
    assert.deepEqual(this.count, count);
  }
}
