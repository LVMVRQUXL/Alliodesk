const bodyParser = require('body-parser');

const {HttpCodeUtil, ValidatorUtil} = require('../utils');
const FeedbackController = require('../controllers').FeedbackController;
const endpoints = require('./endpoints').FeedbackEndpoints;
const FeedbackValidator = require('./validators').FeedbackValidator;
const UserMiddleware = require('../middlewares').UserMiddleware;

module.exports = (app) => {
    /**
     * TODO: add rights
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
            const feedback = {
                id: parseInt(req.params.id),
                score: req.body.score ? parseInt(req.body.score) : undefined,
                title: req.body.title,
                description: req.body.description
            };
            if (!ValidatorUtil.isValidId(feedback.id)
                || (!FeedbackValidator.isValidScore(feedback.score)
                    && !ValidatorUtil.isValidString(feedback.title)
                    && !ValidatorUtil.isValidString(feedback.description))
                || (feedback.score && !FeedbackValidator.isValidScore(feedback.score))
                || (feedback.title && !ValidatorUtil.isValidString(feedback.title))) {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            } else {
                const oldFeedback = await FeedbackController.findOneFeedbackFromId(feedback.id);
                if (!oldFeedback) {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                } else {
                    const values = FeedbackController.buildUpdatingValues(oldFeedback, feedback);
                    await FeedbackController.updateOneFeedbackFromId(oldFeedback.id, values);
                    res.status(HttpCodeUtil.OK).end();
                }
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/feedbacks/{id}':
     *   delete:
     *     description: Remove one feedback from id
     *     tags:
     *       - Feedbacks
     *     security:
     *       - bearerToken: []
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
     *       401:
     *         description: Unauthorized operation
     *       404:
     *         description: Can't find feedback from id
     *       500:
     *         description: An internal error has occurred
     */
    app.delete(endpoints.FeedbacksId, UserMiddleware.checkIfUserIsLoggedInFromToken(), async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!ValidatorUtil.isValidId(id)) {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            } else {
                const feedback = await FeedbackController.findOneFeedbackFromId(id);
                if (!feedback) {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                } else if (feedback.user_id !== parseInt(req.userLoggedIn.id)) {
                    res.status(HttpCodeUtil.UNAUTHORIZED).end();
                } else {
                    await FeedbackController.removeOneFeedbackFromId(id);
                    res.status(HttpCodeUtil.OK).end();
                }
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
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
     * @swagger
     *
     * '/feedbacks':
     *   post:
     *     description: Create a new feedback
     *     tags:
     *       - Feedbacks
     *     security:
     *       - bearerToken: []
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
     *       401:
     *         description: Unauthorized operation
     *       409:
     *         description: A conflict error has occurred while creating a new feedback
     *       500:
     *         description: An internal error has occurred
     */
    app.post(endpoints.Feedbacks, UserMiddleware.checkIfUserIsLoggedInFromToken(), bodyParser.json(),
        async (req, res) => {
            try {
                const feedback = {
                    score: parseInt(req.body.score),
                    title: req.body.title,
                    description: req.body.description
                };
                if (FeedbackValidator.isValid(feedback)) {
                    feedback.user_id = req.userLoggedIn.id;
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
        }
    );
};
