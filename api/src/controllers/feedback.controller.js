const FeedbackService = require('../services').FeedbackService;
const StringUtil = require('../utils').StringUtil;

class FeedbackController {
    /**
     * Create a new feedback
     *
     * @param feedback {object}
     *
     * @returns {Promise<FeedbackDTO|undefined>}
     */
    async createFeedback(feedback) {
        const createdFeedback = await FeedbackService.create(feedback);

        return createdFeedback ? FeedbackService.mapToDTO(createdFeedback) : undefined;
    }

    /**
     * Find all feedbacks
     *
     * @returns {Promise<FeedbackDTO[]>}
     * TODO: unit tests
     */
    async findAllFeedbacks() {
        const feedbacks = await FeedbackService.findAll();

        return feedbacks.map(feedback => FeedbackService.mapToDTO(feedback));
    }

    /**
     * Find one feedback from id
     *
     * @param id {number}
     *
     * @returns {Promise<FeedbackDTO|undefined>}
     * TODO: unit tests
     */
    async findOneFeedbackFromId(id) {
        const feedback = await FeedbackService.findOne({id: id});

        return feedback ? FeedbackService.mapToDTO(feedback) : undefined;
    }

    /**
     * Check if given feedback is valid or not
     *
     * @param feedback {object}
     *
     * @returns {boolean}
     * TODO: unit tests
     */
    isValid(feedback) {
        return feedback.score && feedback.score >= 1 && feedback.score <= 5
            && !StringUtil.isEmpty(feedback.title);
    }

    /**
     * Remove one feedback from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
     */
    async removeOneFeedbackFromId(id) {
        if (!await this.findOneFeedbackFromId(id)) {
            return false;
        }

        return await FeedbackService.destroy({id: id});
    }

    /**
     * Update one feedback from id
     *
     * @param id {number}
     * @param score {number}
     * @param title {string}
     * @param description {string}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
     */
    async updateOneFeedbackFromId(id, score, title, description) {
        const feedback = await this.findOneFeedbackFromId(id);
        if (!feedback) {
            return false;
        }
        const values = {};
        if (score !== feedback.score) {
            values.score = score;
        }
        if (title !== feedback.title) {
            values.title = title;
        }
        if (description && description !== '' && description !== feedback.description) {
            values.description = description;
        }

        return await FeedbackService.update(values, {id: id});
    }
}

module.exports = new FeedbackController();
