const ValidatorUtil = require('../../utils').ValidatorUtil;

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
            && ValidatorUtil.isValidString(feedback.title);
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
}

module.exports = new FeedbackValidator();
