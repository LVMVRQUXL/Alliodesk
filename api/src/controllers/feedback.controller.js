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
}

module.exports = new FeedbackController();
