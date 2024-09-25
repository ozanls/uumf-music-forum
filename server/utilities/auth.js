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

// Check the users role. If the user has the required role, continue. If not, return 403.
function authorizeRoute(permissions) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (permissions.includes(userRole)) {
            return next();
        }
        res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
    };
};

// Check if the user is the owner of the post
async function isOwner(req, res, next) {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    console.log('post.userId: ', post.userId);
    console.log('req.user.id: ', req.user.id);

    // Check if the post exists, if not return 404
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the owner of the post, if not return 403
    if (post.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
    }

    // If the user is the owner of the post, continue
    req.post = post;
    next();
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

        // Allow the user to delete their own account
        if (req.method === 'DELETE' && resourceId == req.user.id) {
            return next();
        }

        // If the resource exists, check if the user is the owner of the resource
        if (resource){
            if (resource.userId === req.user.id) {
                req.resource = resource;
                return next();
            }
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
    authorizeRoute,
    verifyAuthorization,
    isOwner
};