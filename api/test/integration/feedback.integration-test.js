const {describe, it, afterEach} = require('mocha');
const request = require('supertest');
const assert = require('assert');

const feedbackRouter = require('../../src/routes/feedback.router');
const HttpCodeUtil = require('../../src/utils').HttpCodeUtil;
const endpoints = require('../../src/routes/endpoints').FeedbackEndpoints;
const FeedbackService = require('../../src/services').FeedbackService;
const FeedbackController = require('../../src/controllers').FeedbackController;

module.exports = (app, sandbox) => describe('Feedback integration tests', () => {
    feedbackRouter(app);

    afterEach(() => sandbox.restore());

    describe(`GET ${endpoints.Feedbacks}`, () => {
        it(`should return ${HttpCodeUtil.NO_CONTENT}`, async () => {
            // SETUP
            const findAll = sandbox.stub(FeedbackService, 'findAll');
            const mapToDTO = sandbox.stub(FeedbackService, 'mapToDTO');
            const findAllFeedbacks = sandbox.spy(FeedbackController, 'findAllFeedbacks');
            findAll.resolves([]);

            // CALL
            // noinspection JSUnresolvedFunction
            const response = await request(app).get(endpoints.Feedbacks);

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
