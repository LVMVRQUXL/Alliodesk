const crypto = require('crypto');

class SecurityUtil {

    /**
     * Hash string
     *
     * @param string {string}
     *
     * @return {string}
     */
    hash(string) {
        const hash = crypto.createHash('sha256');
        hash.update(string);
        return hash.digest('hex').toString()
    }

    /**
     * Generate a random token
     *
     * @return {Promise<string>}
     */
    randomToken() {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(32, (err, buf) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf.toString('hex'));
                }
            });
        });
    }

}

module.exports = new SecurityUtil();
