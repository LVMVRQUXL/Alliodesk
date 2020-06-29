const FeedbackService = require('../services').FeedbackService;

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
     */
    async findOneFeedbackFromId(id) {
        const feedback = await FeedbackService.findOne({id: id});

        return feedback ? FeedbackService.mapToDTO(feedback) : undefined;
    }

    /**
     * Remove one feedback from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
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
     * @param feedback {object}
     *
     * @returns {Promise<boolean>}
     */
    async updateOneFeedbackFromId(id, feedback) {
        const oldFeedback = await this.findOneFeedbackFromId(id);
        if (!oldFeedback) {
            return false;
        }
        const values = {
            score: feedback.score !== oldFeedback.score ? feedback.score : undefined,
            title: feedback.title !== oldFeedback.title ? feedback.title : undefined,
            description: feedback.description && feedback.description !== oldFeedback.description ?
                feedback.description : null
        };
        const where = {id: id};

        return await FeedbackService.update(values, where);
    }
}

module.exports = new FeedbackController();
