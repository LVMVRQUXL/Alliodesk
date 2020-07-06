const describe = require('mocha').describe;
const sandbox = require('sinon').createSandbox();

describe('UNIT TESTS', () => {
    describe('Controllers', () => require('./v1/controllers')());

    describe('Validators', () => require('./v1/validators')(sandbox));
});
