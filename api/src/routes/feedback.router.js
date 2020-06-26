const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const FeedbackController = require('../controllers').FeedbackController;
const endpoints = require('./endpoints').FeedbackEndpoints;

module.exports = (app) => {
    // PUT '/feedbacks/{id}' => Update one feedback from id
    // TODO: integration tests
    app.put(endpoints.FeedbacksId, bodyParser.json(), async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const feedback = {
                score: parseInt(req.body.score),
                title: req.body.title,
                description: req.body.description
            };
            if (id && id > 0 && FeedbackController.isValid(feedback)) {
                const result = await FeedbackController.updateOneFeedbackFromId(id, feedback);
                if (result) {
                    res.status(HttpCodeUtil.OK).end();
                } else {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    // DELETE '/feedbacks/{id}' => Remove one feedback from id
    // TODO: integration tests
    app.delete(endpoints.FeedbacksId, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (id && id > 0) {
                const result = await FeedbackController.removeOneFeedbackFromId(id);
                if (result) {
                    res.status(HttpCodeUtil.OK).end();
                } else {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    // GET '/feedbacks/{id}' => Get one feedback from id
    // TODO: integration tests
    app.get(endpoints.FeedbacksId, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (id && id > 0) {
                const feedback = await FeedbackController.findOneFeedbackFromId(id);
                if (feedback) {
                    res.status(HttpCodeUtil.OK).json(feedback);
                } else {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    // GET '/feedbacks' => Get all feedbacks
    // TODO: integration tests
    app.get(endpoints.Feedbacks, async (req, res) => {
        try {
            const feedbacks = await FeedbackController.findAllFeedbacks();
            if (feedbacks.length > 0) {
                res.status(HttpCodeUtil.OK).json(feedbacks);
            } else {
                res.status(HttpCodeUtil.NO_CONTENT).end();
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    // POST '/feedbacks' => Create a new feedback
    // TODO: integration tests
    app.post(endpoints.Feedbacks, bodyParser.json(), async (req, res) => {
        try {
            const feedback = {
                score: parseInt(req.body.score),
                title: req.body.title,
                description: req.body.description
            };
            if (FeedbackController.isValid(feedback)) {
                const feedbackDTO = await FeedbackController.createFeedback(feedback);
                if (feedbackDTO) {
                    res.status(HttpCodeUtil.CREATED).json(feedbackDTO);
                } else {
                    res.status(HttpCodeUtil.CONFLICT).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });
};
