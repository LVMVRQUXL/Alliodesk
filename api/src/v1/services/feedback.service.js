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
     * Remove one feedback corresponding to given where clause
     *
     * @param where {object}
     *
     * @returns {Promise<void>}
     */
    async destroy(where) {
        await Feedback.destroy({where: where});
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
        return new FeedbackDTO(feedback);
    }

    /**
     * Update one feedback corresponding to where clause
     *
     * @param values {object}
     * @param where {object}
     *
     * @returns {Promise<void>}
     */
    async update(values, where) {
        await Feedback.update(values, {where: where});
    }
}

class FeedbackDTO {
    constructor(feedback) {
        this.id = parseInt(feedback.id);
        this.score = parseInt(feedback.score);
        this.title = feedback.title;
        this.description = feedback.description;
        this.user_id = parseInt(feedback.user_id);
        this.service_id = parseInt(feedback.service_id);
    }
}

module.exports = new FeedbackService();
