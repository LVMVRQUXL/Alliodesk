const describe = require('mocha').describe;
const app = require('express')();
const sandbox = require('sinon').createSandbox();

describe('INTEGRATION TESTINGS', () => require('./v1/feedback.integration-test')(app, sandbox));
