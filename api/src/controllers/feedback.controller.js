const FeedbackService = require('../services').FeedbackService;

class FeedbackController {
    /**
     * Create a new feedback
     *
     * @param score {number}
     * @param title {string}
     * @param description {string}
     *
     * @returns {Promise<FeedbackDTO>}
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
}

module.exports = new FeedbackController();
