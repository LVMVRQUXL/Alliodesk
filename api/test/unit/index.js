const describe = require('mocha').describe;

describe('UNIT TESTS', () => {
    describe('Controllers', () => require('./controllers')());

    describe('Validators', () => require('./validators')());
});
