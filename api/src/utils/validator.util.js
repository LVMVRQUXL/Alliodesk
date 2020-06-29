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
}

module.exports = new ValidatorUtil();
