const {describe, it} = require('mocha');
const request = require('supertest');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');

const HttpCodeUtil = require('../../src/utils').HttpCodeUtil;
const endpoints = require('../../src/routes/endpoints').FeedbackEndpoints;

module.exports = (app) => describe('Feedback integration tests', () => {
    const MockDependencies = {
        Controllers: {
            FeedbackController: {
                createFeedback: sinon.stub()
            }
        }
    };
    const feedbackRouter = proxyquire('../../src/routes/feedback.router', {
        '../controllers': MockDependencies.Controllers
    });

    feedbackRouter(app);

    describe(`# POST ${endpoints.Feedbacks}`, () => {
        it(`should return ${HttpCodeUtil.CREATED} code with JSON`, async () => {
            // SETUP
            const fakeFeedback = {
                score: 5,
                title: 'Super service !'
            };
            MockDependencies.Controllers.FeedbackController.createFeedback.resolves(fakeFeedback);

            // CALL
            const response = await request(app)
                .post(endpoints.Feedbacks)
                .send(fakeFeedback)
                .expect(HttpCodeUtil.CREATED);

            // VERIFY
            assert.deepEqual(response.body, fakeFeedback);

            // TEARDOWN
            MockDependencies.Controllers.FeedbackController.createFeedback.resetHistory();
        });
    });
});
