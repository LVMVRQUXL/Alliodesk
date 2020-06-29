const bodyParser = require('body-parser');

const {HttpCodeUtil, ValidatorUtil} = require('../utils');
const FeedbackController = require('../controllers').FeedbackController;
const endpoints = require('./endpoints').FeedbackEndpoints;
const FeedbackValidator = require('./validators').FeedbackValidator;

module.exports = (app) => {
    /**
     * TODO: tests with Postman
     * @swagger
     *
     * '/feedbacks/{id}':
     *   put:
     *     description: Update one feedback from id
     *     tags:
     *       - Feedbacks
     *     parameters:
     *       - name: id
     *         description: Feedback's id
     *         in: path
     *         required: true
     *       - name: score
     *         description: Feedback's score
     *         in: body
     *       - name: title
     *         description: Feedback's title
     *         in: body
     *       - name: description
     *         description: Feedback's description
     *         in: body
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid parameters
     *       404:
     *         description: Can't find feedback from id
     *       500:
     *         description: An internal error has occurred
     */
    app.put(endpoints.FeedbacksId, bodyParser.json(), async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const feedback = {
                score: parseInt(req.body.score),
                title: req.body.title,
                description: req.body.description
            };
            if (ValidatorUtil.isValidId(id) && (
                FeedbackValidator.isValidScore(feedback.score)
                || ValidatorUtil.isValidString(feedback.title)
                || ValidatorUtil.isValidString(feedback.description)
            )) {
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

    /**
     * TODO: tests with Postman
     * @swagger
     *
     * '/feedbacks/{id}':
     *   delete:
     *     description: Remove one feedback from id
     *     tags:
     *       - Feedbacks
     *     parameters:
     *       - name: id
     *         description: Feedback's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid parameters
     *       404:
     *         description: Can't find feedback from id
     *       500:
     *         description: An internal error has occurred
     */
    app.delete(endpoints.FeedbacksId, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (ValidatorUtil.isValidId(id)) {
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

    /**
     * TODO: tests with Postman
     * @swagger
     *
     * '/feedbacks/{id}':
     *   get:
     *     description: Get one feedback from id
     *     tags:
     *       - Feedbacks
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Feedback's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid parameters
     *       404:
     *         description: Can't find feedback from id
     *       500:
     *         description: An internal error has occurred
     */
    app.get(endpoints.FeedbacksId, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (ValidatorUtil.isValidId(id)) {
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

    /**
     * TODO: tests with Postman
     * @swagger
     *
     * '/feedbacks':
     *   get:
     *     description: Get all feedbacks
     *     tags:
     *       - Feedbacks
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       204:
     *         description: No feedbacks to return
     *       500:
     *         description: An internal error has occurred
     */
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

    /**
     * TODO: tests with Postman
     * @swagger
     *
     * '/feedbacks':
     *   post:
     *     description: Create a new feedback
     *     tags:
     *       - Feedbacks
     *     parameters:
     *       - name: score
     *         description: Feedback's score
     *         in: body
     *         required: true
     *       - name: title
     *         description: Feedback's title
     *         in: body
     *         required: true
     *       - name: description
     *         description: Feedback's description
     *         in: body
     *     responses:
     *       201:
     *         description: New feedback successfully created
     *       400:
     *         description: Invalid parameters
     *       409:
     *         description: A conflict error has occurred while creating a new feedback
     *       500:
     *         description: An internal error has occurred
     */
    app.post(endpoints.Feedbacks, bodyParser.json(), async (req, res) => {
        try {
            const feedback = {
                score: parseInt(req.body.score),
                title: req.body.title,
                description: req.body.description
            };
            if (FeedbackValidator.isValid(feedback)) {
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
