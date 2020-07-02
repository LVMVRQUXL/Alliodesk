const {describe, it, afterEach} = require('mocha');
const request = require('supertest');
const assert = require('assert');

const HttpCodeUtil = require('../../../src/v1/utils').HttpCodeUtil;
const FeedbackService = require('../../../src/v1/services').FeedbackService;
const FeedbackController = require('../../../src/v1/controllers').FeedbackController;

module.exports = (app, sandbox) => describe('Feedback integration tests', () => {
    const baseEndpoint = '/feedbacks';
    app.use(baseEndpoint, require('../../../src/v1/routers/feedback.router'));

    afterEach(() => sandbox.restore());

    describe(`GET ${baseEndpoint}`, () => {
        it(`should return ${HttpCodeUtil.NO_CONTENT}`, async () => {
            // SETUP
            const findAll = sandbox.stub(FeedbackService, 'findAll');
            const mapToDTO = sandbox.stub(FeedbackService, 'mapToDTO');
            const findAllFeedbacks = sandbox.spy(FeedbackController, 'findAllFeedbacks');
            findAll.resolves([]);

            // CALL
            // noinspection JSUnresolvedFunction
            const response = await request(app).get(baseEndpoint);

            // VERIFY
            assert.equal(response.statusCode, HttpCodeUtil.NO_CONTENT);
            sandbox.assert.calledOnce(findAllFeedbacks);
            sandbox.assert.calledWithExactly(findAllFeedbacks);
            sandbox.assert.calledOnce(findAll);
            sandbox.assert.calledWithExactly(findAll);
            sandbox.assert.notCalled(mapToDTO);

            // TEARDOWN
            sandbox.reset();
        });
    });
});
