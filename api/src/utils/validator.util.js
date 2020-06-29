const StringUtil = require('./string.util');

class ValidatorUtil {
    /**
     * TODO: unit tests
     * Check if given id is valid or not
     *
     * @param id {number}
     *
     * @returns {boolean}
     */
    isValidId(id) {
        return id && id > 0;
    }

    /**
     * TODO: unit tests
     * Check if given string is valid or not
     *
     * @param string {string}
     *
     * @returns {boolean}
     */
    isValidString(string) {
        return !StringUtil.isEmpty(string);
    }
}

module.exports = new ValidatorUtil();
