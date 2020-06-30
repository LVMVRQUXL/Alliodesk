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
     * @returns {Promise<boolean>}
     */
    async destroy(where) {
        try {
            await Feedback.destroy({where: where});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
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

    /**
     * Update one feedback corresponding to where clause
     *
     * @param values {object}
     * @param where {object}
     *
     * @returns {Promise<boolean>}
     */
    async update(values, where) {
        try {
            await Feedback.update(values, {where: where});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
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
