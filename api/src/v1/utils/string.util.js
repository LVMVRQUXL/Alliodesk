class StringUtil {
    /**
     * Check if given string is empty or not
     *
     * @param string {string}
     *
     * @returns {boolean}
     */
    isEmpty(string) {
        return !string || string === '';
    }
}

module.exports = new StringUtil();
