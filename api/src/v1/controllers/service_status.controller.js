const ServiceStatusService = require('../services').ServiceStatusService;

const validatedStatus = 'validated';
const pendingStatus = 'pending';
const rejectedStatus = 'rejected';

class ServiceStatusController {
    get validatedStatus() { return validatedStatus; }
    get pendingStatus() { return pendingStatus; }
    get rejectedStatus() { return rejectedStatus; }

    /**
     * Create status for validated services
     *
     * @returns {Promise<boolean>}
     */
    async createValidatedStatus() { return await ServiceStatusService.create({ status: validatedStatus }); }

    /**
     * Create status for pending services
     *
     * @returns {Promise<boolean>}
     */
    async createPendingStatus() { return await ServiceStatusService.create({ status: pendingStatus }); }

    /**
     * Create status for rejected services
     *
     * @returns {Promise<boolean>}
     */
    async createRejectedStatus() { return await ServiceStatusService.create({ status: rejectedStatus }); }

    /**
     * Find one service's status from given value
     *
     * @param statusValue {string}
     *
     * @returns {Promise<Service_status | null>}
     */
    async findServiceStatusFromValue(statusValue) {
        return await ServiceStatusService.findOne({status: statusValue});
    }
}

module.exports = new ServiceStatusController();
