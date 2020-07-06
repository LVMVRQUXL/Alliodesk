const ServiceStatusController = require('../controllers').ServiceStatusController;

class ServiceStatusMiddleware {
    /**
     * Check if status for services are existing
     *
     * @returns {function(req, res, next)}
     */
    checkStatusForServices() {
        return async (req, res, next) => {
            let status = await ServiceStatusController.findServiceStatusFromValue(
                ServiceStatusController.validatedStatus
            );
            if (!status) { await ServiceStatusController.createValidatedStatus(); }
            status = await ServiceStatusController.findServiceStatusFromValue(ServiceStatusController.pendingStatus);
            if (!status) { await ServiceStatusController.createPendingStatus(); }
            status = await ServiceStatusController.findServiceStatusFromValue(ServiceStatusController.rejectedStatus);
            if (!status) { await ServiceStatusController.createRejectedStatus(); }
            next();
        }
    }
}

module.exports = new ServiceStatusMiddleware();
