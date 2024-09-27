const { Post } = require('../models');

// Check if the user is authenticated
function isAuthenticated(req, res, next) {

    // If the user is authenticated, continue
    if (req.isAuthenticated()) {
        return next();
    }

    // If the user is not authenticated, return 401
    res.status(401).json({ message: 'Unauthorized: Please log in and try again.' });
}

function verifyAuthorization(model, resourceIdParam, permissions) {
    return async (req, res, next) => {
        const userRole = req.user?.role;

        // Check if the user is not logged in
        if (!req.user || req.user.id === null) {
            return res.status(403).json({ message: 'Unauthorized: Please log in and try again.' });
        }

        // Allow admins to create a new resource without checking for an existing resource
        if (req.method === 'POST' && permissions.includes(userRole)) {
            return next();
        }

        const resourceId = req.params[resourceIdParam];
        const resource = await model.findByPk(resourceId);

        // If the resource exists, check if the user is the owner of the resource
        if (resource && resource.userId === req.user.id) {
            req.resource = resource;
            return next();
        }

        // Check if the user has one of the required roles
        if (permissions.includes(userRole)) {
            return next();
        }

        // If none of the above conditions are met, deny access
        res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
    };
}

module.exports = {
    isAuthenticated,
    verifyAuthorization
};