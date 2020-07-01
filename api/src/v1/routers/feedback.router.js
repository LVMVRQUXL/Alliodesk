const router = require('express').Router();
const bodyParser = require('body-parser');

const {HttpCodeUtil, ValidatorUtil} = require('../utils');
const {FeedbackController, ServiceController} = require('../controllers');
const FeedbackValidator = require('./validators').FeedbackValidator;
const UserMiddleware = require('../middlewares').UserMiddleware;

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/feedbacks/{id}':
 *   put:
 *     description: Update one feedback from id
 *     tags:
 *       - Feedbacks
 *     security:
 *       - bearerToken: []
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
 *       401:
 *         description: Unauthorized operations
 *       404:
 *         description: Can't find feedback from id
 *       500:
 *         description: An internal error has occurred
 */
router.put('/:id', UserMiddleware.checkIfUserIsLoggedInFromToken(), bodyParser.json(),
    async (req, res) => {
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
                } else if (oldFeedback.user_id !== parseInt(req.userLoggedIn.id)) {
                    res.status(HttpCodeUtil.UNAUTHORIZED).end();
                } else {
                    const values = FeedbackController.buildUpdatingValues(oldFeedback, feedback);
                    await FeedbackController.updateOneFeedbackFromId(oldFeedback.id, values);
                    res.status(HttpCodeUtil.OK).end();
                }
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    }
);

// noinspection JSUnresolvedFunction
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
router.delete('/:id', UserMiddleware.checkIfUserIsLoggedInFromToken(), async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.get('/:id', async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.get('/', async (req, res) => {
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/feedbacks':
 *   post:
 *     description: Create a new feedback about a service
 *     tags:
 *       - Feedbacks
 *       - Services
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
 *       - name: service_id
 *         description: Service's id
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: New feedback successfully created
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized operation
 *       404:
 *         description: Can't find service from id
 *       409:
 *         description: A conflict error has occurred while creating a new feedback
 *       500:
 *         description: An internal error has occurred
 */
router.post('/', UserMiddleware.checkIfUserIsLoggedInFromToken(), bodyParser.json(),
    async (req, res) => {
        try {
            const feedback = {
                score: parseInt(req.body.score),
                title: req.body.title,
                description: req.body.description,
                user_id: parseInt(req.userLoggedIn.id),
                service_id: parseInt(req.body.service_id)
            };
            if (!FeedbackValidator.isValid(feedback) || !ValidatorUtil.isValidId(feedback.service_id)) {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            } else {
                if (!await ServiceController.findOneServiceFromId(feedback.service_id)) {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                } else {
                    const feedbackDTO = await FeedbackController.createFeedback(feedback);
                    if (feedbackDTO) {
                        res.status(HttpCodeUtil.CREATED).json(feedbackDTO);
                    } else {
                        res.status(HttpCodeUtil.CONFLICT).end();
                    }
                }
            }
        } catch (e) {
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    }
);

module.exports = router;
