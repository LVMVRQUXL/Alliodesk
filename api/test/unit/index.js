const describe = require('mocha').describe;
const sandbox = require('sinon').createSandbox();

describe('UNIT TESTS', () => {
    describe('Controllers', () => require('./controllers')());

    describe('Validators', () => require('./validators')(sandbox));
});
