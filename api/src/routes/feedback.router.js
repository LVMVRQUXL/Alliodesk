const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const FeedbackController = require('../controllers').FeedbackController;

const routes = {
    FeedbacksId: '/feedbacks/:id',
    Feedbacks: '/feedbacks'
};

module.exports = (app) => {
    // TODO: PUT '/feedbacks/{id}' => Update one feedback from id
    app.put(routes.FeedbacksId, bodyParser.json(), async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // TODO: DELETE '/feedbacks/{id}' => Remove one feedback from id
    app.delete(routes.FeedbacksId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // GET '/feedbacks/{id}' => Get one feedback from id
    // TODO: integration tests
    app.get(routes.FeedbacksId, async (req, res) => {
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
    app.get(routes.Feedbacks, async (req, res) => {
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
    app.post(routes.Feedbacks, bodyParser.json(), async (req, res) => {
        try {
            const score = parseInt(req.body.score);
            const title = req.body.title;
            const description = req.body.description;
            if (score && score >= 1 && score <= 5 && title && title !== '') {
                const feedback = await FeedbackController.createFeedback(score, title, description);
                if (feedback) {
                    res.status(HttpCodeUtil.CREATED).json(feedback);
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
