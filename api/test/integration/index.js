const describe = require('mocha').describe;
const app = require('express')();

describe('--- INTEGRATION TESTINGS ---', () => {
    require('./feedback.integration-test')(app);
});
