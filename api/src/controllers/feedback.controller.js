const FeedbackService = require('../services').FeedbackService;

class FeedbackController {
    /**
     * Create a new feedback
     *
     * @param score {number}
     * @param title {string}
     * @param description {string}
     *
     * @returns {Promise<FeedbackDTO|undefined>}
     * TODO: unit tests
     */
    async createFeedback(score, title, description) {
        const feedback = await FeedbackService.create({
            score: score,
            title: title,
            description: description && description !== '' ? description : null
        });

        return feedback ? FeedbackService.mapToDTO(feedback) : undefined;
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
}

module.exports = new FeedbackController();
