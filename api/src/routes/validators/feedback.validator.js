const StringUtil = require('../../utils').StringUtil;

class FeedbackValidator {
    /**
     * TODO: unit tests
     * Check if given feedback is valid or not
     *
     * @param feedback {object}
     *
     * @returns {boolean}
     */
    isValid(feedback) {
        return feedback !== undefined && feedback !== null
            && this.isValidScore(feedback.score)
            && this.isValidTitle(feedback.title);
    }

    /**
     * Check if given feedback's description is valid or not
     *
     * @param description {string}
     *
     * @returns {boolean}
     */
    isValidDescription(description) {
        return !StringUtil.isEmpty(description);
    }

    /**
     * Check if given feedback's score is valid or not
     *
     * @param score {number}
     *
     * @returns {boolean}
     */
    isValidScore(score) {
        return score && score >= 1 && score <= 5;
    }

    /**
     * Check if given feedback's title is valid or not
     *
     * @param title {string}
     *
     * @returns {boolean}
     */
    isValidTitle(title) {
        return !StringUtil.isEmpty(title);
    }
}

module.exports = new FeedbackValidator();
