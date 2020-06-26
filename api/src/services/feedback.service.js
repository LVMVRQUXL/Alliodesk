const {Feedback} = require('../models');

class FeedbackService {
    /**
     * Create a feedback with given values
     *
     * @param values {object}
     *
     * @returns {Promise<Feedback>}
     */
    async create(values) {
        return Feedback.create(values);
    }

    /**
     * Find all feedbacks
     *
     * @returns {Promise<Feedback[]>}
     */
    async findAll() {
        return Feedback.findAll();
    }

    /**
     * Find one feedback corresponding to given where clause
     *
     * @param where {object}
     *
     * @returns {Promise<Feedback|null>}
     */
    async findOne(where) {
        return Feedback.findOne({where: where});
    }

    /**
     * Map given feedback to DTO
     *
     * @param feedback {Feedback}
     *
     * @returns {FeedbackDTO}
     */
    mapToDTO(feedback) {
        return new FeedbackDTO(feedback.id, feedback.score, feedback.title, feedback.description);
    }
}

class FeedbackDTO {
    constructor(id, score, title, description) {
        this.id = id;
        this.score = score;
        this.title = title;
        this.description = description;
    }
}

module.exports = new FeedbackService();
